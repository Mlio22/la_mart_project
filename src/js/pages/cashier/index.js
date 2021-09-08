const { ipcMain, BrowserWindow } = require("electron");
const registerListeners = require("./backend/ipcListener");

class Cashier {
  #cashierWin;

  constructor() {
    this.#initCashierWin();
  }

  #initCashierWin() {
    this.#cashierWin = new BrowserWindow({
      webPreferences: {
        nodeIntegration: true,
        enableRemoteModule: true,
      },
      minWidth: 1200,
      minHeight: 768,
      fullscreenable: false,
    });

    this.#cashierWin.maximize();

    this.#cashierWin.loadFile("./src/templates/cashier.html");
    this.#setCashierListeners();
  }

  #setCashierListeners() {
    this.#cashierWin.once("closed", () => {
      this.#cashierWin = null;
    });

    ipcMain.once("close-cashier", () => {
      this.#cashierWin.close();
    });

    registerListeners();
  }

  get window() {
    return this.#cashierWin;
  }
}

module.exports = {
  Cashier,
};
