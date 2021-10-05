/**
 * @typedef {import ("../main.js").CashierUI} CashierUI
 * @typedef {import ("./shortcuts-helper/shortcut-objects/cancel").Cancel} Cancel
 * @typedef {import ("./shortcuts-helper/shortcut-objects/checkBalance").CheckBalance} CheckBalance
 * @typedef {import ("./shortcuts-helper/shortcut-objects/openTransaction").OpenTransaction} OpenTransaction
 * @typedef {import ("./shortcuts-helper/shortcut-objects/payment").Payment} Payment
 * @typedef {import ("./shortcuts-helper/shortcut-objects/searchItem").SearchItem} SearchItem
 * @typedef {(Cancel | CheckBalance | OpenTransaction | Payment | SearchItem)} Submenu
 * @typedef {("F1" | "F2" | "F3" | "F4" | "F5" | "F6" | "F7" | "F8" | "F9" | "F10" | "F11" | "F12" )} ShortcutKey
 */

import { submenuButtons } from "./shortcuts-helper/shortcutList.js";

export class SubmenuWrapper {
  /**
   * contains opened submenu
   * @type {Submenu}
   * @private
   */
  #openedSubmenu = null;

  /**
   * contains submenu cover element
   * @type {HTMLElement}
   * @private
   */
  #submenuCoverElement;

  /**
   * contains submenu wrapper element
   * @type {HTMLElement}
   * @private
   */
  #submenuWrapperElement;

  /**
   * creating submenu wrapper
   * @param {CashierUI} window - referenced CashierUI
   */
  constructor(window) {
    this.window = window;
  }

  init() {
    this.#submenuCoverElement = this.window.element.querySelector(".submenuCover");
    this.#submenuWrapperElement = this.#submenuCoverElement.querySelector(".submenu");

    this.#listenEvent();
  }

  /**
   * shows current submenu
   */
  showSubmenu() {
    this.#submenuCoverElement.classList.remove("hidden");
  }

  /**
   * hides current submenu and clears it
   */
  hideSubmenu() {
    this.#submenuCoverElement.classList.add("hidden");

    this.#clearSubmenu();
  }

  /**
   *
   * @private
   */
  #clearSubmenu() {
    this.#openedSubmenu = null;

    // clear the submenu element
    this.#submenuWrapperElement.innerHTML = "";

    // focus to latest item
    if (this.window.name === "cashier") {
      this.window.childs.transactionList.currentTransaction.transactionInfo.itemList.focusToLatestBarcode();
    }
  }

  /**
   * open a submenu by shortcut
   * @param {ShortcutKey} shortcutKey
   * @param {?Object} [props] - additional options, depends on shortcut type, e.g. SearchItem needs hint, referencedItem and type
   */
  openSubmenu(shortcutKey, props = {}) {
    if (this.#openedSubmenu === null) {
      const { name, object, shortcutFunction, html } = submenuButtons[shortcutKey];
      const submenuProperties = {
        name: name,
        html: html,
      };

      if (object) {
        // create shortcut object
        this.#openedSubmenu = new object(this, submenuProperties, props);
      }

      if (shortcutFunction) {
        // execute shortcut function
        shortcutFunction(this);
      }
    }
  }

  /**
   * add listeners to submenuWrapper
   * @private
   */
  #listenEvent() {
    // listening to cover,
    // when a submenu is showed, and the cover clicked, then the submenu will close
    this.#submenuCoverElement.addEventListener("click", (e) => {
      if (e.target === this.#submenuCoverElement) {
        this.hideSubmenu();
      }
    });

    // escape button listener
    this.window.element.addEventListener("keydown", ({ key }) => {
      if (this.#openedSubmenu && key === "Escape") {
        this.hideSubmenu();
      }
    });
  }

  /**
   * returns submenuWrapperElement's element
   * @type {HTMLElement}
   */
  get element() {
    return this.#submenuWrapperElement;
  }

  /**
   * @type {Submenu}
   * returns current opened submenu object
   */
  get openedSubmenu() {
    return this.#openedSubmenu;
  }
}
