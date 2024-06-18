//I think a lot of these need to have a return value and dont, need to check on that

async function setupChatRoutes(app) {
    app.get('/api/chatrooms', async (req, res) => {
        console.log("user: ", req.user, "requesting chatrooms");
        //db call to get id of chatrooms that this user is part of
        const userChats = await models.Chat.findAll({ where: {user_id: req.user.id } });
        console.log('the chat rows are: ', userChats)
        //db call to get the chatrooms
        //get just name, id, avatar pic or something
        const chatrooms = userChats; //to test the above

        //send the chatrooms back if successful
        res.status(200);
        res.json({
            success: true,
            error: null,
            data: {
                results: chatrooms
            }
        });
    }
    );

    app.get('/api/chat', async (req, res) => {
        //responds a chatroom given a chatroom id
        if (!req.query?.id) {
            res.status(400).json({
                success: false,
                error: "Bad request",
                data: null
            });
            return;
        }
        chatId = req.query.id;
        const chat = await models.chat.findOne({ where: { id: chatId } });
        if (chat) {
            res.status(200).json({
                success: true,
                error: null,
                data: {
                    results: chat
                }
            });
        } else {
            res.status(500).json({
                success: false,
                error: "Internal server error",
                data: null
            });
        }

    })

    app.post('/api/chat', async (req, res) => { 
        //take userid array (creator and added), initial message, creates a chat
        chatName = req.query.name;
        userArray = req.data.userArray;
        //UNTESTED CODE BELOW
        if (userArray && initialMessage ) {
            creatorId = userArray[0]
            const newChat = await models.Chat.create({ name: chatName, creator_id: creatorId }).then(
                newChat.addUsers(userArray)
            ).then(
                async (initialMessage) => {
                    const newMessage = await models.Message.create(
                        { content: initialMessage.content, 
                            type: initialMessage.type, 
                            sender_id: creatorId, 
                            chat_id: newChat.id 
                        });
                }
            ).catch(error => {
                console.error("Error creating new chat: ", error);
            });
        } else {
            console.log("Error creating new chat: No userArray or no initialMessage");
        }
        if (newChat && newMessage) { //why is this not reading newMessage? check and fix before test
            res.status(200).json({
                success: true,
                error: null,
                data: {
                    results: {
                        newChat: newChat,
                        newMessage: newMessage
                    }
                }
            });
        } else {
            res.status(500).json({
                success: false,
                error: "Internal server error",
                data: null
            });
        }
    });
}


module.exports = setupChatRoutes;