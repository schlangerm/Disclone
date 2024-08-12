const express = require('express');
const cors = require('cors');
const dbconfig = require('./db/config/db');
const dotenv = require('dotenv');
const { setupAuthRoutes, isAuthenticated } = require('./routers/auth.router');
const setupChatRoutes = require('./routers/chat.router');
const setupUserRoutes = require('./routers/user.router');
const setupMessageRoutes = require('./routers/message.router');
const setupSocketHandlers = require('./sockets/socketHandlers');
const { sq } = require('./db/config/db');
const { createServer } = require('node:http');
const { Server } = require('socket.io');

dotenv.config();

async function main() {
    const app = express();
    app.use(express.json())
    const PORT = 3001; 

    await dbconfig.testDbConnection()

    app.use(cors({
       origin: 'http://localhost:5173',
       methods: ['GET', 'POST', 'PUT', 'DELETE']          
    }));                            

    console.log('\nsync starting');
    sq.sync().then(() => {
        console.log('All models synced');
    }).catch(error => {
        console.error(`Error syncing models: ${error}`);
    });

    const server = createServer(app);

    const io = new Server(server, {
        cors: {
            origin: 'http://localhost:5173',
            methods: ['GET','POST']
        }
    });

    app.use('/api', isAuthenticated)

    setupAuthRoutes(app);

    setupChatRoutes(app);

    setupUserRoutes(app);

    setupMessageRoutes(app, io);

    setupSocketHandlers(io);

    server.listen(PORT, (error) => {
        if (!error) {
            console.log(`Server is successfully running and app is listening on port ${PORT}`);
        } else { 
            console.log(`Server Error: \n${error}`);
        }
    });
};

main()