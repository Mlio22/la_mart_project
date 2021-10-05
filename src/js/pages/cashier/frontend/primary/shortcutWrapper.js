import { submenuButtons } from "./shortcuts-helper/shortcutList.js";
import { Shortcut } from "./shortcuts-helper/shortcut.js";

/**
 * @typedef {import ("../main").CashierUI} CashierUI
 * 
 * @typedef Shortcuts - contains all shortcut details
 * @type {Object}
 * @property {Shortcut} F1
 * @property {Shortcut} F2
 * @property {Shortcut} F3
 * @property {Shortcut} F4
 * @property {Shortcut} F5
 * @property {Shortcut} F6
 * @property {Shortcut} F7
 * @property {Shortcut} F8
 * @property {Shortcut} F9
 * @property {Shortcut} F10
 * @property {Shortcut} F11
 * @property {Shortcut} F12

 */

export class ShortcutWrapper {
  /**
   * contains all shortcut details
   * @type {Shortcuts}
   */
  #shortcuts = {};

  /**
   * creates and initialize shortcut in cashier UI
   * @param {CashierUI} cashier - referenced CashierUI
   */
  constructor(cashier) {
    this.cashier = cashier;
  }

  init() {
    this.shortcutElement = this.cashier.element.querySelector(".shortcuts");

    this.#setShortcuts();
    this.#listenEvent();
  }

  /**
   * sets shortcut(s) availability
   * @param {Object} keyAndAvailablity
   * @param {?Boolean} [keyAndAvailablity.F1]
   * @param {?Boolean} [keyAndAvailablity.F2]
   * @param {?Boolean} [keyAndAvailablity.F3]
   * @param {?Boolean} [keyAndAvailablity.F4]
   * @param {?Boolean} [keyAndAvailablity.F5]
   * @param {?Boolean} [keyAndAvailablity.F6]
   * @param {?Boolean} [keyAndAvailablity.F7]
   * @param {?Boolean} [keyAndAvailablity.F8]
   * @param {?Boolean} [keyAndAvailablity.F9]
   * @param {?Boolean} [keyAndAvailablity.F10]
   * @param {?Boolean} [keyAndAvailablity.F11]
   * @param {?Boolean} [keyAndAvailablity.F12]
   */
  setShortcutAvailability(keyAndAvailablity) {
    // this.#shortcuts[shortcutKey].availability = availability;
    Object.keys(keyAndAvailablity).forEach((shortcutKey) => {
      this.#shortcuts[shortcutKey].availability = keyAndAvailablity[shortcutKey];
    });
  }

  /**
   * set and initializes all shortcuts (F1 - F12) and stores it to #shortcuts
   * @private
   */
  #setShortcuts() {
    Object.keys(submenuButtons).forEach((key) => {
      this.#shortcuts[key] = new Shortcut(this, key, submenuButtons[key]);
    });
  }

  /**
   * add listeners to each shortcuts elements
   */
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
