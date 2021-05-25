const { BrowserWindow, ipcMain } = require('electron');

class Stock {
    constructor() {
        this.__stockData = [];
        this.__stockWin = null;


        this.__initStockWin();
        this.__initStockListener();
    }

    __initStockWin() {
        this.__stockWin = new BrowserWindow({
            webPreferences: {
                nodeIntegration: true
            },
            minWidth: 1200,
            minHeight: 800,
        })

        this.__stockWin.loadFile("./src/templates/stock.html");
    }

    __initStockListener() {
        this.__stockWin.on('close', () => {
            this.__stockWin = null
        })
    }

    get window() {
        return this.__stockWin;
    }

}

module.exports = {
    Stock
}