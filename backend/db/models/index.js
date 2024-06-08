// Imported models
const UserModel = require('./user').User;
const ChatModel = require('./chat').Chat;
const MessageModel = require('./message').Message;

// Initialize models
const models = {
  User: UserModel,
  Chat: ChatModel,
  Message: MessageModel
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