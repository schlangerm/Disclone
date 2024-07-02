// Imported models
const UserModel = require('./user').User;
const ChatModel = require('./chat').Chat;
const MessageModel = require('./message').Message;

// Imported junction model(s)
const User_ChatModel = require('./junctions/user_chat').User_Chat;

// Initialize models
const models = {
  User: UserModel,
  Chat: ChatModel,
  Message: MessageModel,
  User_Chat: User_ChatModel
};
console.log('\n model index running \n');
// Apply associations
Object.keys(models).forEach(modelName => {
    console.log('\nmodel name:', modelName, 'associating');
    if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

module.exports = models;