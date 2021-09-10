const { Op } = require("sequelize");
const db = require("../models/models");

async function craateTransactionAll() {
  // output: id

  const transactionAll = await db.TransaksiKeseluruhan.create(),
    id = transactionAll.dataValues.id;

  return id;
}

async function createTransactionItem({ transactionId, itemId }) {
  /**
   * param:
   * id_transaksi_keseluruhan
   *
   * item details: item id (if through searchItem)
   *  */

  const transactionDetail = {
    id_transaksi_keseluruhan: transactionId,
    id_barang: itemId, // if through searchItem
  };

  const transactionItem = await db.TransaksiBarang.create(transactionDetail),
    id = transactionItem.dataValues.id;

  return id;
}

module.exports = { craateTransactionAll, createTransactionItem };
