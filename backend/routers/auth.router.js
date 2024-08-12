const models = require('../db/models');
const jwt = require('jsonwebtoken');

const SECRETKEY = process.env.SECRETKEY;
const LOGREQUESTS = false;

async function setupAuthRoutes(app) {
    app.post('/auth/login', async (req, res) => { // email and pass in body
        try {
            let userJson = req.body
            const user = await models.User.findOne({ where: { email: userJson.email } });
            console.log(`login request from user: ${user?.id}`);
            if (user && user.authenticate(userJson.password)){
                const token = jwt.sign(
                    { id: user.id }, SECRETKEY, { expiresIn: '8h' } 
                );

                res.status(200).json({
                    success: true,
                    error: null,
                    data: {
                        user: {
                            id: user.id,
                            email: user.email,
                            name: user.name
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

    app.post('/auth/register', async (req, res) => { 
        try {
            if (!req.body.email || !req.body.password) {
                res.json({
                    success: false,
                    error: 'Email and password are required to register',
                    data: null
                })
                res.status(400)
                return
            }
            let userJson = req.body

            const newUser = await models.User.create({ email: userJson.email, password: userJson.password });
            console.log(`User: ${newUser.email}'s auto-generated ID: ${newUser.id}`);
            if (newUser) {
                const token = jwt.sign(
                    { id: newUser.id }, SECRETKEY, { expiresIn: '8h' } 
                );
                res.status(200).json({
                    success: true,
                    error: null,
                    data: {
                        message: `Successful registry of ${new_user.email}`,
                        user: {
                            id: new_user.id,
                            email: new_user.email,
                            name: new_user.name
                        },
                        token: token

                    }
                });
            }
        } catch (error) {
            console.log(`Error registering new user: ${error}`);
            res.status(500).json({
                success: false,
                error: 'Internal Server Error',
                data: null
            });
        }
    });
}

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
            try {
                const dbUser = await models.User.findByPk(userIdFromJWT); 
                req.user = dbUser;
                if (!dbUser) {
                    return res.status(401).json({
                        success: false,
                        error: 'Unauthorized',
                        data: null
                    });
                }
            } catch (error) {
                console.log(`error in auth middleware ${error}`);
            }
            next()
            
        });
    } else {
        res.status(401).json({
            success: false,
            error: 'Unauthorized',
            data: null
        }); //unauthorized
    }
};

module.exports = {
    setupAuthRoutes, 
    isAuthenticated
};