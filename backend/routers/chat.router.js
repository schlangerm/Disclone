const models = require('../db/models');


async function setupChatRoutes(app) {
    app.get('/api/chatrooms', async (req, res) => {
        console.log("user: ", req.user, "requesting chatrooms");
        if (models.User_Chat) {
            console.log("User_Chat model is defined")
        }
        const userChats = await models.User.findOne({ 
            where: { id: req.user.id },
            attributes: { exclude: ['password'] },
            include: [
                {
                    model: models.Chat,
                    through: { attributes: [] },
                    include: [
                        {
                            model: models.Message
                        },
                        {
                            model: models.User,
                            attributes: { exclude: ['password'] },
                            through: { attributes: [] }
                        }
                    ]
                }
            ]
        });
        console.log('the chat rows are: ', userChats)
        //db call to get the chatrooms
        const chatrooms = userChats.Chats
        console.log("chatrooms: ", chatrooms)

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
        //responds a chatroom and its messages and users added given a chatroom id, checks if user is part of chat
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
                include: [
                    {
                        model: models.Message
                    },
                    {
                        model: models.User,
                        attributes: { exclude: 'password' },
                        through: { attributes: [] }
                    }
                ]
            });
            // The below will need to be reviewed for use case- is this for all users to access? who is going to call this route?
            if (chatMessagesUsers) {
                const userInChatBool = chatMessagesUsers.Users.some(user => user.id === requestingUserId)

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

        // 2 users min, initial message, chat name required
        if (!userArray || !initialMessage || !chatName) {
            return res.status(400).json({
                success: false,
                error: "Bad request",
                data: null
            });
        }

        try {
            const creatorId = req.user.id; 
            const newChat = await models.Chat.create({ 
                name: chatName
            });
            const creator = await models.User.findOne({
                where: { id: creatorId }
            });
            await newChat.addUser(creator, { through: { is_owner: true }});
            
            const members = await models.User.findAll({
                where: { email: userArray }
            });

            await newChat.addUsers(members);

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

    app.delete('/api/chat', async (req, res) => {
        console.log('\nquery id: ', req.query.id);
        const chatId = req.query.id;
        const userId = req.user.id;

        // user must be the owner - db check 
        // TODO: handle admin access
        try {
            owner = await models.User_Chat.findOne({
                where: { user_id: userId, chat_id: chatId } 
            });

            console.log("owner claim: ", owner)
            if (!owner.is_owner) {
                return res.status(403).json({
                    success: false,
                    error: "Forbidden",
                    data: null
                });
            }
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                success: false,
                error: "Internal server error",
                data: null
            })
        }
        try {
            await models.Chat.destroy({
                where: { id: chatId }
            });

            console.log(`Chat of ID ${chatId} destroyed by ${userId}`);
            res.status(200).json({
                success: true,
                error: null,
                data: {
                    results: `${chatId} destroyed`
                }
            });

        } catch (error) {
            console.log(error);
            res.status(500).json({
                success: false,
                error: "Internal server error",
                data: null
            });
        }
    });
}


module.exports = setupChatRoutes;