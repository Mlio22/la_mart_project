import { submenuButtons } from "./shortcuts-helper/shortcutList.js";
import { Shortcut } from "./shortcuts-helper/shortcut.js";

export class ShortcutWrapper {
  #shortcuts = {};

  constructor(cashier) {
    this.cashier = cashier;
    this.shortcutElement = cashier.element.querySelector(".shortcuts");

    this.#setShortcuts();
    this.#listenEvent();
  }

  setShortcutAvailability(keyAndAvailablity) {
    // this.#shortcuts[shortcutKey].availability = availability;
    Object.keys(keyAndAvailablity).forEach((shortcutKey) => {
      this.#shortcuts[shortcutKey].availability = keyAndAvailablity[shortcutKey];
    });
  }

  #setShortcuts() {
    Object.keys(submenuButtons).forEach((key) => {
      this.#shortcuts[key] = new Shortcut(this, key, submenuButtons[key]);
    });
  }

  #listenEvent() {
    // set cashier shortcut key listeners
    // called by cashier
    this.cashier.element.addEventListener("keydown", ({ key }) => {
      if (submenuButtons[key] && this.#shortcuts[key].availability) {
        this.cashier.childs.submenu.openSubmenu(key);
      }
    });
  }
}
