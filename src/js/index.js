const { app, ipcMain } = require('electron');
// const ipcMain = require('electron');

const { Home } = require('./pages/home/index.js');

const singleInstanceLock = app.requestSingleInstanceLock();
let home

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
    app.quit();
}

if (!singleInstanceLock) {
    app.quit();
} else {
    app.on('ready', () => {
        home = new Home();
    });

    app.on('second-instance', () => {
        if (home) {
            home.window.focus();
        }
    })

    app.on('window-all-closed', () => {
        app.quit()
    })
}

ipcMain.on('quit-app', () => {
    app.quit()
})