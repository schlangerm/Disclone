const { sq } = require("../../config/db"); 
const { DataTypes } = require('sequelize');

const User_Chat = sq.define('User_Chat', {
    user_id: {
        type: DataTypes.UUID,
        allowNull: false
    },
    chat_id: {
        type: DataTypes.UUID,
        allowNull: false
    },
    is_owner: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
}, {
    tableName: 'users_chats'
});

User_Chat.associate = (models) => {
    User_Chat.belongsTo(models.User, { foreignKey: 'user_id' });
    User_Chat.belongsTo(models.Chat, { foreignKey: 'chat_id'});
};

module.exports = { User_Chat }