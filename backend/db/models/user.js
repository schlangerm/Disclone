const { sq } = require('../config/db');
const { DataTypes, Sequelize } = require('sequelize');
const useBcrypt = require('sequelize-bcrypt');

const User = sq.define('User', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            is: /^[\w-]+(?:\.[\w-]+)*@(?:[\w-]+\.)+[a-zA-Z]{2,7}$/
        },
        unique: true //TODO: deal with back and frontend for when returns SequalizeUniqueConstraintError (email already exists)
    },
    name: {
        type: DataTypes.STRING,
        defaultValue: null,
        allowNull: true,
        unique: true //TODO: same as above
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    tableName: 'users'
});

useBcrypt(User)

User.associate = (models) => {
    User.belongsToMany(models.Chat, { through: models.User_Chat, foreignKey: 'user_id', otherKey: 'chat_id' });
    User.hasMany(models.Message, { foreignKey: 'sender_id' });
};

module.exports = { User }
