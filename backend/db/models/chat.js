const { sq } = require('../config/db');
const { DataTypes } = require('sequelize');


const Chat = sq.define('Chat', {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4, // automatically generate UUID
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Chat name cannot be empty'
            }
        }
    }
}, {
    tableName: 'chats',
    timestamps: true,
});


Chat.associate = (models) => {
    Chat.belongsToMany(models.User, { through: models.User_Chat, foreignKey: 'chat_id', otherKey: 'user_id' }); //without otherKey, the table had chat_id and UserId, strangely
    Chat.hasMany(models.Message, { foreignKey: 'chat_id'});
};

module.exports = { Chat };