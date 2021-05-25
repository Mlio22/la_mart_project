const { BrowserWindow, ipcMain } = require('electron');
const cashier_submenus = [{
        shortcutKey: 'F2',
        name: 'search item',
        channel: 'search-item',
    },
    {
        shortcutKey: 'F4',
        name: 'payment',
        channel: 'open-payment',
        actions: [{
                shortcutKey: 'F3',
                channel: 'cancel-payment',
            },
            {
                shortcutKey: 'F4',
                channel: 'proceed-payment',
            },
        ]
    },
    {
        shortcutKey: 'F5',
        name: 'print bill',
        channel: 'print-bill',
    },
    {
        shortcutKey: 'F6',
        name: 'save transaction',
        channel: 'save-transaction',
    },
    {
        shortcutKey: 'F7',
        name: 'open transaction',
        channel: 'open-transaction',
    },
    {
        shortcutKey: 'F9',
        name: 'cancel transaction',
        channel: 'cancel-transaction',
        actions: [{
                channel: 'continue-transaction'
            },
            {
                channel: 'reset-transaction'
            }
        ]
    },
    {
        shortcutKey: 'F10',
        name: 'close cashier',
        channel: 'close-cashier',
    },
    {
        shortcutKey: 'F11',
        name: 'new page',
        channel: 'new-page',
    },
    {
        shortcutKey: 'F12',
        name: 'check balance',
        channel: 'check-balance',
    },
];

class Cashier {
    constructor() {
        this.__openedSubMenu = null
        this.__initCashierWin();

        // this.__transaction = 

        // child elements
        // this.__itemListElement = document.querySelector('')
    }

    __initCashierWin() {
        this.__cashierWin = new BrowserWindow({
            webPreferences: {
                nodeIntegration: true
            },
            minWidth: 1200,
            minHeight: 768,
        });

        this.__cashierWin.maximize();

        this.__cashierWin.loadFile("./src/templates/cashier.html");
        this.__setCashierListeners();
    }

    __setCashierListeners() {
        this.__cashierWin.once('closed', () => {
            this.__cashierWin = null
        });

        this.__setInputListeners();
        this.__setIpcListeners();
    }

    __setInputListeners() {
        this.__cashierWin.webContents.on('before-input-event', (event, input) => {
            if (this.__openedSubMenu == null) {
                cashier_submenus.forEach(submenu => {
                    if (submenu.shortcutKey == input.key) {
                        event.preventDefault();

                        this.__cashierWin.webContents.send(submenu.channel)
                        this.__openedSubMenu = submenu
                    }
                })
            } else {
                if (this.__openedSubMenu.actions) {
                    this.__openedSubMenu.actions.forEach(action => {
                        if (input.key === action.shortcutKey) {
                            event.preventDefault();
                        }
                    })
                }

                if (input.key === 'Escape') {
                    this.__cashierWin.webContents.send('close-submenu');
                    this.__openedSubMenu = null;
                }
            }
        })
    }

    __setIpcListeners() {
        cashier_submenus.forEach(submenu => {
            const { channel } = submenu
            ipcMain.on(channel, () => {
                this.__openedSubMenu = submenu
            })
        })
    }

    get window() {
        return this.__cashierWin;
    }

}

module.exports = {
    Cashier
}