const { Sequelize } = require("sequelize");
const dotenv = require('dotenv');

dotenv.config();

const DBPASS = process.env.DBPASS

//console.log(DBPASS, typeof(DBPASS));

const sequelize = new Sequelize('disclone', 'postgres', DBPASS, {
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