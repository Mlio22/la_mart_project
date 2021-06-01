import { submenuButtons } from "../primary/shortcuts/shortcutList.js";
const { ipcRenderer } = require("electron");

export class Shortcuts {
  constructor(cashier, shortcutElement, submenuCoverElement) {
    this.__cashier = cashier;

    this.__shortcutElement = shortcutElement;
    this.__submenuCoverElement = submenuCoverElement;
    this.__submenuElement = this.__submenuCoverElement.querySelector(".submenu");

    this.__openedSubmenu = null;

    this.__listenIPC();
    this.__listenEvent();
  }

  __listenIPC() {
    // closes the submenu when IPCMain send a close-submenu
    ipcRenderer.on("close-submenu", () => {
      this.hideSubmenu();
    });

    Object.keys(submenuButtons).forEach((submenuName) => {
      const { object } = submenuButtons[submenuName];

      ipcRenderer.on(submenuName, () => {
        this.__openedSubMenu = new object(this.__submenuElement);
        this.__submenuCoverElement.classList.remove("hidden");
      });
    });
  }

  __listenEvent() {
    // listening to cover,
    // when a submenu is showed, and the cover clicked, then the submenu will close
    this.__submenuCoverElement.addEventListener("click", (e) => {
      if (e.target === this.__submenuCoverElement) {
        this.hideSubmenu();
      }
    });

    // listening to each shortcut button
    Object.keys(submenuButtons).forEach((submenuName) => {
      const { element: shortcutElement } = submenuButtons[submenuName];

      document.querySelector(shortcutElement).addEventListener("click", () => {
        this.openShortcut(submenuName, {});
      });
    });
  }

  //   opening a shortcut
  openShortcut(submenuName, props) {
    const { object: ShortcutObject } = submenuButtons[submenuName];

    // send to IPC
    ipcRenderer.send(submenuName);

    // create shortcut object
    this.__openedSubMenu = new ShortcutObject(this, this.__submenuElement, props);
  }

  showSubmenu() {
    //!   this method only called by child submenu
    this.__submenuCoverElement.classList.remove("hidden");
  }

  hideSubmenu() {
    this.__submenuCoverElement.classList.add("hidden");
    this.__openedSubMenu = null;

    // clear the submenu element
    this.__submenuElement.innerHTML = "";
  }

  // extraordinary methods

  // function to transaction
  // function called from search-item
  createNewItem(itemData) {
    this.__cashier.createNewItem(itemData);
  }

  // function to transaction
  getTotalPrice() {
    return this.__cashier.getTotalPrice();
  }
}
