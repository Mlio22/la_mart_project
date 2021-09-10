// index.js
const { Sequelize } = require("sequelize");
const { Umzug } = require("umzug");
const sequelize = require("./helpers/sequelize");

// init umzug
const umzug = new Umzug({
  migrations: {
    glob: ["{seeders,migrations/*}/*.js", { cwd: __dirname }],
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
