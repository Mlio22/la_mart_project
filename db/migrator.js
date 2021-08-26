// index.js
const config = require("../config/config_sequelize.json");
const { Sequelize } = require("sequelize");
const { Umzug } = require("umzug");
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

// init umzug
const umzug = new Umzug({
  migrations: {
    glob: ["migrations/*.js", { cwd: __dirname }],
    resolve: ({ name, path, context }) => {
      // adjust the migration parameters Umzug will
      // pass to migration methods, this is done because
      // Sequilize-CLI generates migrations that require
      // two parameters be passed to the up and down methods
      // but by default Umzug will only pass the first
      const migration = require(path || "");
      return {
        name,
        up: async () => migration.up(context, Sequelize),
        down: async () => migration.down(context, Sequelize),
      };
    },
  },
  context: sequelize.getQueryInterface(),
  logger: console,
});

(async () => {
  try {
    await sequelize.authenticate();
    await umzug.down({ to: 0 });
    await umzug.up();
    console.log("Connection established and migrations run.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
})();
