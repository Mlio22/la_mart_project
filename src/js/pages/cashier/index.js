const { BrowserWindow } = require("electron");

class Cashier {
  constructor() {
    this.__openedSubMenu = null;
    this.__initCashierWin();
  }

  __initCashierWin() {
    this.__cashierWin = new BrowserWindow({
      webPreferences: {
        nodeIntegration: true,
      },
      minWidth: 1200,
      minHeight: 768,
    });

    this.__cashierWin.maximize();

    this.__cashierWin.loadFile("./src/templates/cashier.html");
    this.__setCashierListeners();
  }

  __setCashierListeners() {
    this.__cashierWin.once("closed", () => {
      this.__cashierWin = null;
    });
  }

  get window() {
    return this.__cashierWin;
  }
}

module.exports = {
  Cashier,
};
