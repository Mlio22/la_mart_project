const { ipcRenderer } = require('electron');

const homeFunctions = {
    openStock: (e) => {
        ipcRenderer.send('open-stock')
    },
    openCashier: () => {
        ipcRenderer.send('open-cashier');
    },
    quitApp: () => {
        ipcRenderer.send('quit-app');
    }
}

const openStockButton = document.querySelector('.menusWrapper__menu.open-stock'),
    openCashierButton = document.querySelector('.menusWrapper__menu.open-cashier'),
    quitAppButton = document.querySelector('.menusWrapper__menu.quit-app');

openStockButton.addEventListener('click', homeFunctions.openStock)
openCashierButton.addEventListener('click', homeFunctions.openCashier)
quitAppButton.addEventListener('click', homeFunctions.quitApp)