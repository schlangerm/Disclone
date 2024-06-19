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

    app.get('/api/chat', async (req, res) => { //Before testing: go to frontend and call this route
        //responds a chatroom and its messages and users added given a chatroom id, attempts to check if user is part of chat
        if (!req.query?.id) {
            return res.status(400).json({
                success: false,
                error: "Bad request",
                data: null
            });
        }

        const chatId = req.query.id;
        try {
            const requestingUserId = req.user.id;

            const chatMessagesUsers = await models.Chat.findOne({ 
                where: { id: chatId }, 
                include: [Message, User] 
            });
            if (chatMessagesUsers) {
                const userInChatBool = chatMessagesUsers.Users.some(user => user.id === requestingUserId)
                //is capitalization important above? we will find out

                if (!userInChatBool) {
                    return res.status(403).json({
                        success: false,
                        error: 'Unauthorized',
                        data: null
                    });
                }

                return res.status(200).json({
                    success: true,
                    error: null,
                    data: {
                        results:  chatMessagesUsers
                    }
                });
            } else {
                return res.status(404).json({
                    success: false,
                    error: "Chat not found",
                    data: null
                });
            }
        } catch (error) {
            console.error("Error fetching chat details: ", error);
            return res.status(500).json({
                success: false,
                error: "Internal server error",
                data: null
            });
        }
    });

    app.post('/api/chat', async (req, res) => { 
        //take userid array (creator and added), initial message, creates a chat
        const chatName = req.query.name;
        const userArray = req.body.userArray;
        const initialMessage = req.body.initialMessage;

        //UNTESTED CODE BELOW
        if (!userArray || !initialMessage) {
            return res.status(400).json({
                success: false,
                error: "Bad request",
                data: null
            });
        }

        try {
            const creatorId = userArray[0]
            const newChat = await models.Chat.create({ 
                name: chatName, 
                creator_id: creatorId 
            });
            
            await newChat.addUsers(userArray);

            const newMessage = await models.Message.create({ 
                content: initialMessage.content, 
                type: initialMessage.type, 
                sender_id: creatorId, 
                chat_id: newChat.id 
            });

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
        } catch (error) {
            console.error("Error creating new chat: ", error);
            res.status(500).json({
                success: false,
                error: "Internal server error",
                data: null
            });
        }
    });
}


module.exports = setupChatRoutes;