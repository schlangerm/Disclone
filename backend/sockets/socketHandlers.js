const models = require("../db/models");
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const SECRETKEY = process.env.SECRETKEY;


module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log('A user connected');
        socket.auth = false;
        socket.on('authenticate', (data) => {
            const token = data.token

            jwt.verify(token, SECRETKEY, async (err, payload) => {
                if (!err) {
                    console.log("Authenticated socket ", socket.id);
                    socket.auth = payload;

                    _.each(io.nsps, (nsp) => { // iterates over all namespaces in io obj
                        if (nsp.sockets[socket.id]) { // check if socket is part of namespace's sockets
                            console.log("restoring socket to ", nsp.name);
                            nsp.connected[socket.id] = socket; // restores socket
                        }
                    });
                } else {
                    console.log(err);
                }
            });
        });

        setTimeout(() => {
            if (!socket.auth) {
                console.log('Disconnecting socket ', socket.id);
                socket.disconnect('unauthorized');
            }
        }, 5000);
        socket.on('disconnect', () => {
            console.log('A user disconnected');
        });
        // event handlers

        socket.on('joinRoom', (room) => {
            socket.join(room);
            console.log(`socket ${socket.id} joined room ${room}`);
        });

        socket.on('sent-message-object', async ({ msgObj, to }) => {
            // put msgObj into db, emit it to everyone else in room
            console.log("\n\n msgobj: ", msgObj);
            try {
                const dbmessage = await models.Message.create({ 
                    content: msgObj.content, 
                    type: msgObj.type,
                    sender_id: msgObj.sender_id,
                    chat_id: msgObj.chat_id 
                });

                io.to(to).emit('inc-message-object', dbmessage);
                console.log('message sent to frontend');
            } catch (error) {
                console.log(error)
                // maybe return here or otherwise stop operations?
            }
        });
    });
}