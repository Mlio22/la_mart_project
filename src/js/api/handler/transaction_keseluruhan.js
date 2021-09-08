const { Op } = require("sequelize");
const db = require("../models/models");

async function craateTransactionAll(param) {
  // output: id

  const transactionAll = db.TransaksiKeseluruhan.create();

  console.log(transactionAll);
  return transactionAll;
}

module.exports = { craateTransactionAll };
