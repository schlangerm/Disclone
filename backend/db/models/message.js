const { sq } = require("../config/db");
const { DataTypes, Sequelize } = require('sequelize');

const Message = sq.define('Message', {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false
    },
    content: {
        type: DataTypes.STRING,
        allowNull: false
    },
    type: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isIn: {
                args: [['text', 'image', 'audio', 'video']],
                msg: 'Message type must be text, image, audio, or video'
            }
        }
    },
}, {
    tableName: 'messages',
    timestamps: true,
});

Message.associate = (models) => {
    Message.belongsTo(models.User, {foreignKey: 'sender_id'});
    Message.belongsTo(models.Chat, {foreignKey: 'chat_id'});
};

module.exports = { Message };