const { app, BrowserWindow, ipcMain } = require("electron");
const { Cashier } = require("../cashier/index.js");
const { Stock } = require("../stock/index.js");

class Home {
  #homeWin;
  #windows = {
    cashier: null,
    stock: null,
    admin: null,
  };

  #homeChildWindows = [
    {
      channel: "open-stock",
      className: Stock,
    },
    {
      channel: "open-cashier",
      className: Cashier,
    },
  ];

  constructor() {
    this.#initHomeWin();
    this.#initHomeListeners();
  }

  #openOtherWindows({ channel, className }) {
    const propertyName = channel.replace("open-", "");

    if (this.#windows[propertyName]) {
      if (this.#windows[propertyName].window === null) {
        this.#windows[propertyName] = new className();
      } else {
        this.#windows[propertyName].window.focus();
      }
    } else {
      this.#windows[propertyName] = new className();
    }
  }

  #initHomeWin() {
    this.#homeWin = new BrowserWindow({
      minWidth: 1100,
      height: 720,
      webPreferences: {
        nodeIntegration: true,
        enableRemoteModule: true,
      },
    });

    this.#homeWin.loadFile("./src/templates/home.html");
  }

  #setIpcListeners() {
    this.#homeChildWindows.forEach((childWindow) => {
      ipcMain.on(childWindow.channel, () => this.#openOtherWindows(childWindow));
    });

    ipcMain.on("quit-app", () => {
      // todo: beri peringatan jika ada aplikasi child yang masih hidup
      app.quit();
    });
  }

  #unsetIpcListeners() {
    this.#homeChildWindows.forEach((childWindow) => {
      ipcMain.removeListener(childWindow.channel, () => this.#openOtherWindows(childWindow));
    });
  }

  #initHomeListeners() {
    this.#setIpcListeners();
    this.#homeWin.once("closed", () => {
      this.#homeWin = null;
      this.#unsetIpcListeners();
    });
  }

  get window() {
    return this.#homeWin;
  }
}

module.exports = {
  Home,
};
