const { app, BrowserWindow, ipcMain } = require("electron");
const { Cashier } = require("../cashier/index.js");
const { Stock } = require("../stock/index.js");

class Home {
  constructor() {
    this.__homeIpcMainListeners = {
      "open-stock": () => {
        if (this.__stockWin) {
          if (this.__stockWin.window === null) {
            this.__stockWin = new Stock();
          } else {
            this.__stockWin.window.focus();
          }
        } else {
          this.__stockWin = new Stock();
        }
      },
      "open-cashier": () => {
        if (this.__cashierWin) {
          if (this.__cashierWin.window === null) {
            this.__cashierWin = new Cashier();
          } else {
            this.__cashierWin.window.focus();
          }
        } else {
          this.__cashierWin = new Cashier();
        }
      },
      "quit-app": () => {
        // todo: beri peringatan jika ada aplikasi child yang masih hidup
        app.quit();
      },
    };

    this.__initHomeWin();
    this.__initHomeListeners();

    this.__cashierWin = null;
    this.__stockWin = null;
  }

  __initHomeWin() {
    this.__homeWin = new BrowserWindow({
      minWidth: 1100,
      height: 720,
      webPreferences: {
        nodeIntegration: true,
      },
    });

    this.__homeWin.loadFile("./src/templates/home.html");
  }

  __setIpcListeners() {
    Object.keys(this.__homeIpcMainListeners).forEach((channel) => {
      ipcMain.on(channel, this.__homeIpcMainListeners[channel]);
    });
  }

  __unsetIpcListeners() {
    Object.keys(this.__homeIpcMainListeners).forEach((channel) => {
      ipcMain.removeListener(channel, this.__homeIpcMainListeners[channel]);
    });
  }

  __initHomeListeners() {
    this.__setIpcListeners();
    this.__homeWin.once("closed", () => {
      this.__homeWin = null;
      this.__unsetIpcListeners();
    });
  }

  get window() {
    return this.__homeWin;
  }
}

module.exports = {
  Home,
};
