const Sequelize = require("sequelize");
const sequelize = require("../helpers/sequelize");

db = {
  sequelize: sequelize,
  Sequelize: Sequelize,
};

async function getFiles(dir) {
  const dirents = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    dirents.map((dirent) => {
      const res = resolve(dir, dirent.name);
      return dirent.isDirectory() ? getFiles(res) : res;
    })
  );
  return Array.prototype.concat(...files);
}

const fs = require("fs");
const { promisify } = require("util");
const { resolve, join } = require("path");
const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);

async function getFiles(dir) {
  const subdirs = await readdir(dir);
  const files = await Promise.all(
    subdirs.map(async (subdir) => {
      const res = resolve(dir, subdir);
      return (await stat(res)).isDirectory() ? getFiles(res) : res;
    })
  );
  return files.reduce((a, f) => a.concat(f), []);
}

// fetching folder
const folders = fs
  .readdirSync(join(__dirname, "..", "models"), { withFileTypes: true })
  .filter((dirent) => dirent.isDirectory())
  .map((dirent) => dirent.name);

// fetching models
folders.forEach((folder) => {
  getFiles(join(__dirname, "..", "models", folder))
    .then((files) => {
      files.forEach((file) => {
        console.log(file);
        const model = require(file)(sequelize, Sequelize.DataTypes);
        db[model.name] = model;
      });
    })
    .catch((e) => console.error(e));
});

module.exports = db;
