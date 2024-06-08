const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const dbconfig = require('./db/config/db');
const dotenv = require('dotenv');
const setupChatRoutes = require('./routers/chat.router');
const models = require('./db/models');
const { sq } = require('./db/config/db');


dotenv.config();

const SECRETKEY = process.env.SECRETKEY
const LOGREQUESTS = false

console.log(SECRETKEY)



async function main() {
    const app = express();
    app.use(express.json())
    const PORT = 3001; 

    await dbconfig.testDbConnection()

    const chatrooms = [
        {
        id: 1,
        name: "Love birds",
        users: [
            {
            id: 1,
            name: "Matt",
            },
            {
            id: 2,
            name: "Liza",
            },
        ],
        messages: [
            {
            id: 1,
            message: "Hii",
            sender: 1,
            chatroom: 1,
            timestamp: new Date(2024, 4, 5),
            },
            {
            id: 2,
            message: "hola",
            sender: 2,
            chatroom: 1,
            timestamp: new Date(),
            },
        ],
        },
        {
        id: 2,
        name: "M names",
        users: [
            {
            id: 1,
            name: "Matt",
            },
            {
            id: 3,
            name: "Manu",
            },
        ],
        messages: [
            {
            id: 3,
            message: "Matt is my name",
            sender: 1,
            chatroom: 2,
            timestamp: new Date(2024, 4, 4),
            },
            {
            id: 4,
            message: "Manu is my name",
            sender: 3,
            chatroom: 2,
            timestamp: new Date(2024, 4, 5),
            },
        ],
        },
    ]

    app.use(cors()); //change if ever in production //
                                                    //
    // app.use(cors({                               //
    //   origin: 'http://localhost:5173'            //
    // }));                             //like this //

    
    console.log('\nsync starting');
    sq.sync({ force: true }).then(() => {
        console.log("All models synced, rewritten");
    }).catch(error => {
        console.error("Error syncing models:", error);
    });

    async function isAuthenticated(req, res, next) {
        //upon login, generate a token, send to frontend (store there), every subsequent request will contain token in headers
        if (LOGREQUESTS) {
            console.log('request: ', req);
        }

        const authHeader = req.headers.authorization;

        if (authHeader) {
            const token = authHeader.split(' ')[1];

            jwt.verify(token, SECRETKEY, async (err, payload) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(403); 
                }
                const userIdFromJWT = payload.id;
                const dbUser = await models.User.findByPk(userIdFromJWT);
                req.user = dbUser;
                next()
                
            });
        } else {
            res.status(401).json({
                success: false,
                error: "Unauthorized",
                data: null
            }); //unauthorized
        }
    };

    app.use('/api', isAuthenticated)

    setupChatRoutes(app);

    app.post('/api/message', async (req, res) => {
        console.log("user: ", req.user, "requesting to send a message to chatroom ", req.data.chatroomId); //make it so: req.data.chatroomId
        //take chatroom id and message text
        message = req.data.message //make it so: req.data.message
        messageType = 'text'
        //sanitize the message
        //send message into db
        try {
            dbmessage = await models.Message.create({ 
            content: message, 
            type: messageType,
            sender_id: req.user.id,
            chat_id: req.data.chatroomId })
        } catch (error) {
            res.status(500).json({
                success: false,
                error: 'Internal server error',
                data: null
            });
            console.log(error);
        }

        res.status(200).json({
            success: true,
            error: null,
            data: {
                message: dbmessage
            },
        });

    });

    app.get('/api/message', async (req, res) => {
        try {
            console.log("user: ", req.user, "requesting to get a message ");
            //takes a messageid and puts a message in the res
            messageid = req.data.messageid;
            dbmessage = models.Message.findOne({ where: {id: messageid }});

            res.status(200).json({
                success: true,
                error: null,
                data: {
                    message: dbmessage.content
                }
            });
            console.log('successful');

        } catch (error) {
            res.status(500).json({
                success: false,
                error: 'Internal server error',
                data: null
            });
            console.log(error);
        }
    });

    app.get('/api/search', (req, res) => {
        console.log("user: ", req.user, "requesting to search ", req.searchTerm);

        //sanitize the search
        //maybe pass to another endpoint for users or chatrooms depending on search type? or handle it here

        //db call for search term

        res.status(200).json({
            success: true,
            error: null,
            data: {
                results: searchResults
            },
        });
    });

    app.get('/api/notifications', (req, res) => {
        console.log("user: ", req.user, "requesting notifications");

        //db call to get notifications the user is connected to (through uuid)

        res.status(200).json({
            success: true,
            error: null,
            data: {
                results: notifications
            },
        });
    });

    //user settings and profile page

    //it might make sense to structure everything that needs user db info to go through one path, but it might also
    //reveal too much about the db? check

    //handled by the /api middleware, so /api/notifications, /api/chatrooms, etc are covered

    //query params for search=?term / search params
    // express request query params

    //list endpoint, get specific endpoint, 



    app.post('/auth/login', async (req, res) => {
        try {
            let user_json = req.body
            console.log("request body: ", user_json)
            const user = await models.User.findOne({ where: { email: user_json.email } });
            console.log("login request from user: ", user, "id: ", user?.id);
            if (user && user.authenticate(user_json.password)){
                // sign jwt here
                const token = jwt.sign(
                    { id: user.id }, SECRETKEY, { expiresIn: '8h' }
                );

                res.status(200).json({ //UPDATE THIS 
                    user: {
                        id: user.id,
                        email: user.email,
                    },
                    token: token
                });
            } else {
                res.status(401).json({ 
                    success: false,
                    error: 'Invalid email or password',
                    data: null
                });
            }
        } catch (error) {
            res.status(500).json({
                success: false,
                error: 'Internal server error',
                data: null
            });
            console.log(error)
        }
    });

    app.post('/auth/register', async (req, res) => { //App called Postman to check
        // TOCHECK TODO: integrate jwt tokens here 
        try {
            if (!req.body.email || !req.body.password) {
                res.json({
                    success: false,
                    error: "Email and password are required to register",
                    data: null
                })
                res.status(403) //lookup bad request
                return
            }
            let user_json = req.body
            console.log("hi!", user_json)
            /* hi! {
                email: 'ddd@sss.com',
                password: 'bloop'
               }*/
            const new_user = await models.User.create({ email: user_json.email, password: user_json.password });
            console.log("User: ", new_user.email, "'s auto-generated ID:", new_user.id);
            res.status(200).json({
                success: true,
                error: null,
                data: {
                    message: `Successful registry of ${new_user.email}`
                }
            })
        } catch (error) {
            console.log("Error registering new user: ", error)
            res.status(500).json({
                success: false,
                error: 'Internal Server Error',
                data: null
            })
        }
    })

    app.listen(PORT, (error) => {
        if (!error)
            console.log("Server is successfully running and app is listening on port " + PORT);
        else 
            console.log("Server Error, ", error);
        }
    );
};

main()