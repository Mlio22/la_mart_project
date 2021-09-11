const { ipcMain } = require("electron");
const { searchItemDB } = require("../../../api/handler/detail_barang");
const {
  craateTransactionAll,
  createTransactionItem,
  editTransactionItem,
} = require("../../../api/handler/transactions");

module.exports = async function registerListeners() {
  ipcMain.handle("search-item-db", async (e, args) => {
    return await searchItemDB({ ...args });
  });

  ipcMain.handle("new-transaction-all", async (e, args) => {
    return await craateTransactionAll({ ...args });
  });

  ipcMain.handle("new-transaction-item", async (e, args) => {
    return await createTransactionItem({ ...args });
  });

  ipcMain.handle("edit-transaction-item", async (e, args) => {
    return await editTransactionItem({ ...args });
  });
};
