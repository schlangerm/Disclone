const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const dbconfig = require('./db/config/db');
const dotenv = require('dotenv');
const setupChatRoutes = require('./routers/chat.router');
const setupSocketHandlers = require('./sockets/socketHandlers');
const models = require('./db/models');
const { sq } = require('./db/config/db');
const { createServer } = require('node:http');
const { Server } = require('socket.io');


dotenv.config();

const SECRETKEY = process.env.SECRETKEY
const LOGREQUESTS = false

//console.log(SECRETKEY, typeof(SECRETKEY));



async function main() {
    const app = express();
    app.use(express.json())
    const PORT = 3001; 

    await dbconfig.testDbConnection()

    // app.use(cors()); //change if ever in production //

    app.use(cors({
       origin: 'http://localhost:5173',
       methods: ['GET', 'POST']          
    }));                            

    
    console.log('\nsync starting');
    sq.sync().then(() => {
        console.log("All models synced, NOT rewritten");
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
                    return res.status(401).json({
                        success: false,
                        error: 'Unauthorized',
                        data: 'ExpiredToken'
                    }); 
                }
                const userIdFromJWT = payload.id;
                const dbUser = await models.User.findByPk(userIdFromJWT); //this will need to be error handled im sure
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
        console.log("user: ", req.user, "requesting to send a message to chatroom ", req.body.chatroomId); //make it so: req.body.chatroomId
        //take chatroom id and message text
        message = req.body.message //make it so: req.body.message
        messageType = 'text' //change when implementing pics etc
        //sanitize the message
        //send message into db
        try {
            dbmessage = await models.Message.create({ 
            content: message, 
            type: messageType,
            sender_id: req.user.id,
            chat_id: req.body.chatroomId })
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
            messageid = req.query.id;
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
                    { 
                        id: user.id,
                        email: user.email }, SECRETKEY, { expiresIn: '8h' } 
                );

                res.status(200).json({
                    success: true,
                    error: null,
                    data: { // POTENTIAL ISSUE - PUT USER OBJ INSIDE DATA
                        user: {
                            id: user.id,
                            email: user.email,
                        },
                        token: token
                    },
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
                res.status(400)
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
            if (new_user) {
                const token = jwt.sign(
                    { 
                        id: new_user.id,
                        email: new_user.email }, SECRETKEY, { expiresIn: '8h' } 
                );
                res.status(200).json({
                    success: true,
                    error: null,
                    data: {
                        message: `Successful registry of ${new_user.email}`,
                        user: {
                            id: new_user.id,
                            email: new_user.email,
                        },
                        token: token

                    }
                });
            }
        } catch (error) {
            console.log("Error registering new user: ", error)
            res.status(500).json({
                success: false,
                error: 'Internal Server Error',
                data: null
            })
        }
    })


    const server = createServer(app);

    const io = new Server(server, {
        cors: {
            origin: 'http://localhost:5173',
            methods: ['GET','POST']
        }
    });

    setupSocketHandlers(io);

    server.listen(PORT, (error) => {
        if (!error)
            console.log("Server is successfully running and app is listening on port " + PORT);
        else 
            console.log("Server Error, ", error);
        }
    );
};

main()