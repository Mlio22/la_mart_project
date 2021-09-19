const { Op } = require("sequelize");
const db = require("../models/models");

async function craateTransactionAll({ log }) {
  // output: id

  const transactionAll = await db.TransaksiKeseluruhan.create({
      log: log,
    }),
    id = transactionAll.dataValues.id;

  return id;
}

async function editTransactionAll({ transactionAllId, log }) {
  // output: undefined

  const transactionAll = await db.TransaksiKeseluruhan.findOne({ where: { id: transactionAllId } });

  if (!transactionAll) return;

  await db.TransaksiKeseluruhan.update({
    log: log,
  });
}

async function createTransactionItem({ transactionAllId, itemId, amount, log }) {
  const transactionItem = await db.TransaksiBarang.create({
      id_transaksi_keseluruhan: transactionAllId,
      id_barang: itemId,
      jumlah: amount,
      log,
    }),
    id = transactionItem.dataValues.id;

  return id;
}

async function editTransactionItem({ transactionItemId, itemId, amount }) {
  const transactionItem = await db.TransaksiBarang.findOne({ where: { id: transactionItemId } });

  if (!transactionItem) return;

  await db.TransaksiBarang.update({
    id_barang: itemId,
    jumlah: amount,
  });
}

module.exports = {
  craateTransactionAll,
  editTransactionAll,
  createTransactionItem,
  editTransactionItem,
};
