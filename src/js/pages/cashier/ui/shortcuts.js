import { submenuButtons } from "../primary/shortcuts/shortcutList.js";
import { Shortcut } from "./shortcut.js";

export class ShortcutWrapper {
  constructor(cashier, shortcutElement, submenuCoverElement) {
    this.__cashier = cashier;

    this.__shortcutElement = shortcutElement;
    this.__submenuCoverElement = submenuCoverElement;
    this.__submenuWrapperElement = this.__submenuCoverElement.querySelector(".submenu");

    this.__shortcuts = {};
    this.__openedSubmenu = null;

    this.__setShortcuts();
    this.__listenEvent();
  }

  __setShortcuts() {
    Object.keys(submenuButtons).forEach((key) => {
      console.log(submenuButtons[key]);
      this.__shortcuts[key] = new Shortcut(this, key, submenuButtons[key]);
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
  }

  //   opening a shortcut
  openSubmenu(shortcutKey, props) {
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

  setShortcutAvailabilty(shortcutKey, availability) {
    this.__shortcuts[shortcutKey].availability = availability;
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
