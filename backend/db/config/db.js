const { Sequelize } = require("sequelize");

const sequelize = new Sequelize('disclone', 'postgres', 'rentos', {
  host: 'localhost',
  port: 5432,
  dialect: 'postgres'
})

const testDbConnection = async () => {
    try {
      await sequelize.authenticate();
      console.log("Connection to database has been established successfully.");
    } catch (error) {
      console.error("Unable to connect to the database:", error);
    }
  };

module.exports = { sq: sequelize, testDbConnection };