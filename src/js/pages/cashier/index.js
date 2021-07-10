const { ipcMain, BrowserWindow } = require("electron");

class Cashier {
  #cashierWin;

  constructor() {
    this.#initCashierWin();
  }

  #initCashierWin() {
    this.#cashierWin = new BrowserWindow({
      webPreferences: {
        nodeIntegration: true,
      },
      minWidth: 1200,
      minHeight: 768,
    });

    this.#cashierWin.maximize();

    this.#cashierWin.loadFile("./src/templates/cashier.html");
    this.#setCashierListeners();
  }

  #setCashierListeners() {
    this.#cashierWin.once("closed", () => {
      this.#cashierWin = null;
    });

    ipcMain.on("close-cashier", () => {
      this.#cashierWin.close();
    });
  }

  get window() {
    return this.#cashierWin;
  }
}

module.exports = {
  Cashier,
};
