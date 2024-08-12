const jwt = require('jsonwebtoken');

const SECRETKEY = process.env.SECRETKEY;

module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log('A user connected');
        socket.auth = false;
        socket.on('authenticate', (data) => {
            const token = data.token

            jwt.verify(token, SECRETKEY, async (err, payload) => {
                if (!err) {
                    console.log(`Authenticated socket ${socket.id}`);
                    socket.auth = payload;
                } else {
                    console.log(err)
                    console.log(`Disconnecting unauthenticated JWT from socket ${socket.id}`);
                    socket.disconnect('unauthorized');
                }
            });
        });

        socket.on('disconnect', () => {
            console.log('A user disconnected');
        });

        socket.on('joinRoom', (room) => {
            socket.join(room);
            console.log(`socket ${socket.id} joined room ${room}`);
        });

        socket.on('leaveRoom', (room) => {
            socket.leave(room)
            console.log(`socket ${socket.id} left room ${room}`);
        })
        /*
        socket.on('sent-message-object', async ({ msgObj, to }) => {
            // put msgObj into db, emit it to everyone else in room
            // make API call instead of sending through socket -- more flexible (devices w/o socket, bots)
            console.log('\n\n msgobj: ', msgObj);
            if (msgObj.content.length > MAX_MSG_LENGTH) {
                socket.emit('message-error', {
                    error: `Message exceeds the maximum allowed length of ${MAX_MESSAGE_LENGTH} characters.`
                });
                return;
                
            }
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
                socket.emit('message-error', {
                    error: 'Failed to send the message due to an internal error.'
                });
            }
        });
        */
    });
}