const { sq } = require("../../config/db"); 
const { DataTypes, Sequelize } = require('sequelize');

const User_Chat = sq.define('User_Chat', {
    user_id: {
        type: DataTypes.UUID,
        allowNull: false
    },
    chat_id: {
        type: DataTypes.UUID,
        allowNull: false
    }
}, {
    tableName: 'users_chats'
});

module.exports = { User_Chat }