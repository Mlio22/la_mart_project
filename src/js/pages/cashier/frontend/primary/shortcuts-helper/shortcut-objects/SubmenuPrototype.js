/**
 * @typedef {import ("../../submenuWrapper").SubmenuWrapper} SubmenuWrapper
 * @typedef {import ("../../../main").CashierUI} CashierUI
 * @typedef {import ("../../../../../stock/main").StockPage} StockPage
 */

/**
 * @abstract
 */
export class Submenu {
  /**
   * @param {SubmenuWrapper} submenuWrapper - reference SubmenuWrapper Instance
   * @param {Object} submenuProperties - options
   */
  constructor(submenuWrapper, submenuProperties) {
    /**
     * contains submenu wrapper
     * @type {SubmenuWrapper}
     * @protected
     */
    this._submenu = submenuWrapper;

    /**
     * contains submenu wrapper element
     * @type {HTMLElement}
     * @protected
     */
    this._submenuWrapper = submenuWrapper.element;

    /**
     * contains submenu name
     * @type {String}
     * @protected
     */
    this._submenuName = submenuProperties.name;

    /**
     * contains submenu element html
     * @type {String}
     * @protected
     */
    this._submenuHTML = submenuProperties.html;

    // refresh wrapper
    this._submenuWrapper.innerHTML = "";
  }

  /**
   * start create submenu and add listener to it (can be overrided)
   * @protected
   */
  _initializeSubmenu() {
    // createSubmenu for creating HTML and append it to cover
    // setSubmenu for gather input selector and setting input values, etc (inherited)
    // setListener for setting listener (inherited)

    this._createSubmenu();
    this._setSubmenu();
    this._setListener();

    // showing the submenu
    this._submenu.showSubmenu();
  }

  /**
   * creates submenu element
   * @protected
   */
  _createSubmenu() {
    // creating submenu element
    this._submenuElement = document.createElement("div");
    this._submenuElement.className = this._submenuName;
    this._submenuElement.innerHTML = this._submenuHTML;

    // add it to wrapper
    this._submenuWrapper.appendChild(this._submenuElement);
  }

  /**@abstract @protected*/
  _setSubmenu() {}

  /**@abstract @protected*/
  _setListener() {}

  /**
   * returns window parent
   * @type {CashierUI | StockPage}
   */
  get window() {
    return this._submenu.window;
  }

  /**
   * returns submenu element
   * @type {HTMLElement}
   */
  get element() {
    return this._submenuElement;
  }
}
