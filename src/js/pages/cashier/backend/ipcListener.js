const { ipcMain } = require("electron");
const { searchItemDB } = require("../../../api/handler/detail_barang");

module.exports = async function registerListeners() {
  ipcMain.handle("search-item-db", async (e, args) => {
    const result = await searchItemDB({ ...args });
    return result;
  });
};
