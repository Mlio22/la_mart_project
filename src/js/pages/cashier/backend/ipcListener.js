const { ipcMain } = require("electron");
const { searchItemDB } = require("../../../api/handler/detail_barang");
const {
  createTransactionAll,
  createTransactionItem,
  editTransactionAll,
  editTransactionItem,
  deleteTransactionAll,
  deleteTransactionItem,
} = require("../../../api/handler/transactions");

module.exports = async function registerListeners() {
  ipcMain.handle("search-item-db", async (e, args) => {
    return await searchItemDB({ ...args });
  });

  ipcMain.handle("new-transaction-all", async (e, args) => {
    return await createTransactionAll({ ...args });
  });

  ipcMain.handle("edit-transaction-all", async (e, args) => {
    return await editTransactionAll({ ...args });
  });

  ipcMain.handle("delete-transaction-all", async (e, args) => {
    return await deleteTransactionAll({ ...args });
  });

  ipcMain.handle("new-transaction-item", async (e, args) => {
    return await createTransactionItem({ ...args });
  });

  ipcMain.handle("edit-transaction-item", async (e, args) => {
    return await editTransactionItem({ ...args });
  });

  ipcMain.handle("delete-transaction-item", async (e, args) => {
    return await deleteTransactionItem({ ...args });
  });
};
