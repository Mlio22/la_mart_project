// index.js
const config = require("../../../../config/config_sequelize.json");
const { Sequelize } = require("sequelize");
const mysql = require("mysql2");

const { host, user, port, password, database } = config.database;

// check if database exists or create one
const connection = mysql.createConnection({ host, port, user, password });
connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);

// init sequelize
const sequelize = new Sequelize(database, user, password, {
  host: host,
  dialect: "mysql",
});

module.exports = sequelize;
