const { Op } = require("sequelize");
const db = require("../models/models");

async function craateTransactionAll() {
  // output: id

  const transactionAll = await db.TransaksiKeseluruhan.create(),
    id = transactionAll.dataValues.id;

  return id;
}

async function createTransactionItem({ transactionAllId, itemId, amount }) {
  const transactionItem = await db.TransaksiBarang.create({
      id_transaksi_keseluruhan: transactionAllId,
      id_barang: itemId,
      jumlah: amount,
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

module.exports = { craateTransactionAll, createTransactionItem, editTransactionItem };
