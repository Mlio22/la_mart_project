const { Op } = require("sequelize");
const db = require("../models/models");

/**
 * Create new transactionAll
 * @param {Object} newTransactionAllData
 * @param {Object} newTransactionAllData.data
 * @param {Array<Object>} newTransactionAllData.data.log - logs for new transactionAll
 * @returns {Promise<number>} id from the new transactionAll
 */
async function createTransactionAll({ data: { log } }) {
  const transactionAll = await db.TransaksiKeseluruhan.create({
      log: log,
    }),
    id = transactionAll.dataValues.id;

  return id;
}

/**
 * Update existing transactionAll logs
 * @param {Object} editTransactionAllData
 * @param {Object} editTransactionAllData.data
 * @param {number} editTransactionAllData.transactionAllId - existing transactionAll id
 * @param {Array<Object>} editTransactionAllData.data.log - latest logs from relating transactionAll
 */
async function editTransactionAll({ transactionAllId, data: { log } }) {
  const transactionAll = await db.TransaksiKeseluruhan.findOne({ where: { id: transactionAllId } });

  await transactionAll.update({
    log: log,
  });
}

/**
 * store last latest log and
 * Delete existing transactionAll
 * @param {Object} deleteTransactionAllData
 * @param {number} deleteTransactionAllData.transactionAllId existing transactionAll id
 * @param {Object} deleteTransactionAllData.data
 * @param {Array<Object>} deleteTransactionAllData.data.log last latest logs
 */

async function deleteTransactionAll({ transactionAllId, data: { log } }) {
  // output: undefined
  const transactionAll = await db.TransaksiKeseluruhan.findOne({
    where: { id: transactionAllId },
  });

  // update log before deleted
  await transactionAll.update({
    log: log,
  });

  await transactionAll.destroy();
}

/**
 * create new transactionItem
 * @param {Object} newTransactionItemData
 * @param {number} newTransactionItemData.transactionAllId existing transactionAll id
 * @param {Object} newTransactionItemData.data
 * @param {number} newTransactionItemData.data.itemId item id, referenced from detail_barang
 * @param {amount} newTransactionItemData.data.amount item amount
 * @param {Array<Object>} newTransactionItemData.data.log item logs
 *
 * @returns {Promise<int>} id new transactionItem id
 */
async function createTransactionItem({ transactionAllId, data: { itemId, amount, log } }) {
  const transactionItem = await db.TransaksiBarang.create({
      id_transaksi_keseluruhan: transactionAllId,
      id_barang: itemId,
      jumlah: amount,
      log,
    }),
    id = transactionItem.dataValues.id;

  return id;
}

/**
 * update existing transactionItem data
 * @async
 * @param {Object} editTransactionItemData
 * @param {number} editTransactionItemData.transactionItemId existing transactionItem
 * @param {Object} editTransactionItemData.data
 * @param {number} editTransactionItemData.data.itemId current new itemId
 * @param {number} editTransactionItemData.data.amount current new amount
 * @param {Promise} editTransactionItemData.data.log latest logs
 *
 */
async function editTransactionItem({ transactionItemId, data: { itemId, amount, log } }) {
  // output: undefined
  const transactionItem = await db.TransaksiBarang.findOne({ where: { id: transactionItemId } });

  await transactionItem.update({
    id_barang: itemId,
    jumlah: amount,
    log,
  });
}

/**
 * add last logs to existing transactionItem
 * and Delete transactionItem
 * @async
 * @param deleteTransactionItemData
 * @param {number} deleteTransactionItemData.transactionItemId existing transactionItem id
 * @param {Object} deleteTransactionItemData.data
 * @param {array<Object>} deleteTransactionItemData.data.log last latest logs
 */
async function deleteTransactionItem({ transactionItemId, data: { log } }) {
  // output: undefined
  const transactionItem = await db.TransaksiBarang.findOne({ where: { id: transactionItemId } });

  await transactionItem.update({
    log: log,
  });

  await transactionItem.destroy();
}

module.exports = {
  createTransactionAll,
  editTransactionAll,
  deleteTransactionAll,
  createTransactionItem,
  editTransactionItem,
  deleteTransactionItem,
};
