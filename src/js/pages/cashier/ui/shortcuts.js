import { submenuButtons } from "../primary/shortcuts/shortcutList.js";

export class Shortcuts {
  constructor(cashier, shortcutElement, submenuCoverElement) {
    this.__cashier = cashier;

    this.__shortcutElement = shortcutElement;
    this.__submenuCoverElement = submenuCoverElement;
    this.__submenuWrapperElement = this.__submenuCoverElement.querySelector(".submenu");

    this.__openedSubmenu = null;

    this.__listenEvent();
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
    Object.keys(submenuButtons).forEach((shortcutKey) => {
      const { name: shortcutName } = submenuButtons[shortcutKey];

      document.querySelector(`.shortcut.${shortcutName}`).addEventListener("click", () => {
        this.openShortcut(shortcutKey, {});
      });
    });
  }

  //   opening a shortcut
  openShortcut(shortcutKey, props) {
    const { name, object, html } = submenuButtons[shortcutKey];
    const submenuProperties = {
      name: name,
      html: html,
    };

    // create shortcut object
    this.__openedSubMenu = new object(this, this.__submenuWrapperElement, submenuProperties, props);
  }

  showSubmenu() {
    //!   this method only called by child submenu
    this.__submenuCoverElement.classList.remove("hidden");
  }

  hideSubmenu() {
    this.__submenuCoverElement.classList.add("hidden");
    this.__openedSubMenu = null;

    // clear the submenu element
    this.__submenuWrapperElement.innerHTML = "";

    this.__cashier.focusToCashier();
  }

  setCashierShortcutKeys(cashierElement) {
    // set cashier shortcut key listeners
    // called by cashier
    this.__openedSubMenu ??= null;

    cashierElement.addEventListener("keydown", ({ key }) => {
      if (this.__openedSubMenu === null && submenuButtons[key]) {
        this.openShortcut(key);
      }

      if (this.__openedSubMenu && key === "Escape") {
        this.hideSubmenu();
      }
    });
  }

  // extraordinary methods

  // function to transaction
  // function called from search-item
  createNewItem(itemData) {
    this.__cashier.createNewItem(itemData);
  }

  // function to transaction
  // function called from payment
  getTotalPrice() {
    return this.__cashier.getTotalPrice();
  }

  // function to transaction
  // function called from payment and cancel
  cancelCurrentTransaction() {
    this.__cashier.cancelCurrentTransaction();
  }

  // function to transaction
  // function called from payment
  completeCurrentTransaction() {
    this.__cashier.completeCurrentTransaction();
  }
}
