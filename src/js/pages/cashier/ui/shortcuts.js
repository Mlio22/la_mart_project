import { submenuButtons } from './shortcuts/shortcutList.js'
const { ipcRenderer } = require('electron');


export class Shortcuts {
    constructor(cashier, shortcutElement, submenuCoverElement) {
        this.__cashier = cashier

        this.__shortcutElement = shortcutElement;
        this.__submenuCoverElement = submenuCoverElement;
        this.__submenuElement = this.__submenuCoverElement.childNodes[1];

        this.__openedSubmenu = null;

        this.__listenIPC();
        this.__listenEvent();
    }

    __listenIPC() {
        // closes the submenu when IPCMain send a close-submenu
        ipcRenderer.on('close-submenu', () => {
            this.closeSubmenu()
        })

        submenuButtons.forEach(submenu => {
            const { channel, object } = submenu;

            ipcRenderer.on(channel, () => {
                this.__openedSubMenu = new object(this.__submenuElement);
                this.__submenuCoverElement.classList.remove('hidden');
            });
        })
    }

    __listenEvent() {
        this.__submenuCoverElement.addEventListener('click', (e) => {
            if (e.target === this.__submenuCoverElement) {
                this.closeSubmenu()
            }
        })

        submenuButtons.forEach(submenu => {
            const { element } = submenu;

            document.querySelector(element).addEventListener('click', () => {
                this.openShortcut(submenuButtons.indexOf(submenu), {})
            })
        })
    }

    openShortcut(submenuNumber, props) {
        const { channel, object } = submenuButtons[submenuNumber];
        ipcRenderer.send(channel);
        this.__openedSubMenu = new object(this.__submenuElement, props);

        this.__submenuCoverElement.classList.remove('hidden');
    }

    closeSubmenu() {
        this.__openedSubMenu = null;
        this.__submenuCoverElement.classList.add('hidden');
    }

}