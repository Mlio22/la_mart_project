const { app, ipcMain } = require("electron");

const { Home } = require("./pages/home/index.js");

const singleInstanceLock = app.requestSingleInstanceLock();
let home;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  // eslint-disable-line global-require
  app.quit();
}

if (!singleInstanceLock) {
  app.quit();
} else {
  app.on("ready", () => {
    // open home when app ready
    home = new Home();
  });

  app.on("second-instance", () => {
    // focus to home when app is double-opened
    if (home) {
      home.window.focus();
    }
  });

  app.on("window-all-closed", () => {
    // end app when all window is closed
    app.quit();
  });
}

ipcMain.on("quit-app", () => {
  app.quit();
});
