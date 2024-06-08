

async function setupChatRoutes(app) {
    app.get('/api/chatrooms', async (req, res) => {
        console.log("user: ", req.user, "requesting chatrooms");
        //db call to get id of chatrooms that this user is part of
        const userChatID = await models.Chat.findOne({ where: {id: req.user.id } });
        console.log('the chat ids are: ', userChatID)
        //db call to get the chatrooms
        //get just name, id, avatar pic or something
        const chatrooms = userChatID; //to test the above

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

    app.get('/api/chat/id', (req, res) => {
        //responds a chatroom given a chatroom id
    })

    app.post('/api/chat/id', async (req, res) => {
        //take userid array (creator and added), initial message, creates a chat

        const newChat = await models.Chat.create({ name: chatName })
        if (userArray) {
            for (userEmail in userArray) {
                
            }
        }
    })
}


module.exports = setupChatRoutes;