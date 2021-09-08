const { ipcMain } = require("electron");
const { searchItemDB } = require("../../../api/handler/detail_barang");
const { craateTransactionAll } = require("../../../api/handler/transaction_keseluruhan");

module.exports = async function registerListeners() {
  ipcMain.handle("search-item-db", async (e, args) => {
    return await searchItemDB({ ...args });
  });

  ipcMain.handle("new-transaction-all", async (e, args) => {
    return await craateTransactionAll({ ...args });
  });
};
