import { Sequelize } from "sequelize";
require("dotenv").config(); // Loads environment variables from .env file

// Create a connection instance
const sequelize = new Sequelize(
  process.env.DB_NAME, // Schema name
  process.env.DB_USER, // MySQL user
  process.env.DB_PASS, // MySQL password
  {
    host: process.env.DB_HOST, // Typically 'localhost'
    dialect: "mysql", // Specifies MySQL
    port: process.env.DB_PORT || 3306, // Default MySQL port
  }
);

// Function to test the connection
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection to MySQL has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

module.exports = { sequelize, connectDB };
