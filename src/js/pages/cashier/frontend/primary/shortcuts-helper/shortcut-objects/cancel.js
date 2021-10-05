/**
 * @typedef {import("../../submenuWrapper.js").SubmenuWrapper} SubmenuWrapper
 */

import { Submenu } from "./SubmenuPrototype.js";

/**
 * @extends {Submenu}
 */
export class Cancel extends Submenu {
  /**
   * contains yes button element
   * @type {HTMLElement}
   * @private
   */
  #yesButton;

  /**
   * contains no button element
   * @type {HTMLElement}
   * @private
   */
  #noButton;

  /**
   * creates cancel submenu
   * @param {SubmenuWrapper} submenuWrapper - referenced SubmenuWrapper instance
   * @param {Object} [submenuProperties={}] - options
   */
  constructor(submenuWrapper, submenuProperties = {}) {
    super(submenuWrapper, submenuProperties);

    this._initializeSubmenu();
  }

  _setListener() {
    this.#yesButton.addEventListener("click", () => {
      this._submenu.window.childs.transactionList.cancelCurrentTransaction();
      this._submenu.hideSubmenu();
    });

    this.#noButton.addEventListener("click", () => {
      this._submenu.hideSubmenu();
    });
  }

  _setSubmenu() {
    this.#yesButton = this._submenuElement.querySelector(".option-yes");
    this.#noButton = this._submenuElement.querySelector(".option-no");
  }
}
