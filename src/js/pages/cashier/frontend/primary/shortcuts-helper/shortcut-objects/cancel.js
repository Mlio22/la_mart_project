/**
 * @typedef {import("../../submenuWrapper.js").SubmenuWrapper} SubmenuWrapper
 */

import { Submenu } from "./SubmenuPrototype.js";
import { isChildOf } from "../../../../../../etc/others.mjs";

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
   * current focused button
   * @type {"yes" | "no"}
   * @private
   */
  #focusedButton = null;

  /**
   * creates cancel submenu
   * @param {SubmenuWrapper} submenuWrapper - referenced SubmenuWrapper instance
   * @param {Object} [submenuProperties={}] - options
   */
  constructor(submenuWrapper, submenuProperties = {}) {
    super(submenuWrapper, submenuProperties);

    this._initializeSubmenu();
    this.#focusYes();
  }

  /**
   * focuses to yes button
   * @private
   */
  #focusYes() {
    this.#yesButton.focus();
    this.#focusedButton = "yes";
  }

  /**
   * focuses to no button
   * @private
   */
  #focusNo() {
    this.#noButton.focus();
    this.#focusedButton = "no";
  }
  /**
   * focuses to yes button
   * @private
   */
  #confirmCancellation() {
    console.log(this._submenu);
    this._submenu.window.childs.transactionList.cancelCurrentTransaction();
    this._submenu.hideSubmenu();
  }

  #cancelCancellation() {
    this._submenu.hideSubmenu();
  }

  _setListener() {
    this._submenuElement.addEventListener("keydown", ({ key }) => {
      if (key === "ArrowLeft") {
        this.#focusYes();
      }

      if (key === "ArrowRight") {
        this.#focusNo();
      }

      if (key === "Enter") {
        if (this.#focusedButton === "yes") this.#confirmCancellation();
        if (this.#focusedButton === "no") this.#cancelCancellation();
      }
    });

    this.#yesButton.addEventListener("click", () => this.#confirmCancellation());

    this.#noButton.addEventListener("click", () => this.#cancelCancellation());
  }

  _setSubmenu() {
    this.#yesButton = this._submenuElement.querySelector(".option-yes");
    this.#noButton = this._submenuElement.querySelector(".option-no");
  }

  /**
   * fix focus e.g. keep focusing to yes button if Cancel is still open
   * @param {HTMLElement} target - new focused element
   */
  fixFocus(target) {
    // check if focused element is child of SearchItem element
    // force focus to hint if not child of searchitem
    if (!isChildOf(this.element, target)) {
      this.#yesButton.focus();
    }
  }
}
