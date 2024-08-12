const models = require('../db/models');

const MAX_MSG_LENGTH = 1250;

async function setupMessageRoutes(app, io) {
    app.post('/api/message', async (req, res) => {
        console.log(`user:  ${req.user.id} requesting to send a message to chatroom: ${req.body.chat_id}`);
        const msgObj = req.body
        if (msgObj.content.length > MAX_MSG_LENGTH) {
            socket.emit('message-error', {
                error: `Message exceeds the maximum allowed length of ${MAX_MESSAGE_LENGTH} characters.`
            });
            return;
        }

        if (msgObj.content.trim() === '') {
            socket.emit('message-error', {
                error: 'Message cannot be empty'
            });
            return;
        }   
        
        try {
            const dbmessage = await models.Message.create({ 
                content: msgObj.content, 
                type: msgObj.type,
                sender_id: req.user.id,
                chat_id: msgObj.chat_id 
            });

            io.to(dbmessage.chat_id).emit('inc-message-object', dbmessage);
            console.log('message sent to frontend');
            res.status(200).json({
                success: true,
                error: null,
                data: {
                    message: dbmessage
                },
            });
        } catch (error) {
            console.log(error)
            socket.emit('message-error', {
                error: 'Failed to send the message due to an internal error.'
            });
            // maybe return here or otherwise stop operations?
        }
        //check out docs for what sockets is exactly
        

    });

    app.get('/api/message', async (req, res) => {
        //takes a messageid and puts a message in the res
        try {
            messageId = req.query.id;
            console.log(`user:  ${req.user} requesting to get message ${messageId}`);
            dbMessage = await models.Message.findOne({ where: {id: messageId }});

            res.status(200).json({
                success: true,
                error: null,
                data: {
                    message: dbMessage
                }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: 'Internal server error',
                data: null
            });
            console.log(`error in api/message route: \n${error}`);
        }
    });
}

module.exports = setupMessageRoutes;