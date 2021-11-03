import { TransactionList } from "./primary/transactionList.js";
import { TotalPrice } from "./primary/totalPrice.js";
import { Notification } from "./primary/notification.js";
import { ShortcutWrapper } from "./primary/shortcutWrapper.js";
import { PaymentDetails } from "./primary/paymentDetails.js";
import { SubmenuWrapper } from "./primary/submenuWrapper.js";
import { SearchItem } from "./primary/shortcuts-helper/shortcut-objects/searchItem.js";
import { Cancel } from "./primary/shortcuts-helper/shortcut-objects/cancel.js";

/**
 * @typedef CashierChilds
 * @property {ShortcutWrapper} shortcuts
 * @property {PaymentDetails} paymentDetails
 * @property {TransactionList} transactionList
 * @property {TotalPrice} totalPrice
 * @property {Notification} notification
 * @property {SubmenuWrapper} submenu
 */

export class CashierUI {
  /**
   * contains child classes
   * @type {CashierChilds}
   */
  #cashierChild = {
    // visible childs (primary)
    shortcuts: new ShortcutWrapper(this),
    paymentDetails: new PaymentDetails(this),
    transactionList: new TransactionList(this),
    totalPrice: new TotalPrice(this),
    notification: new Notification(this),

    // submenu
    submenu: new SubmenuWrapper(this),
  };

  /**
   * creates cashierUI instance
   * @param {HTMLElement} cashierElement
   */
  constructor(cashierElement) {
    this.cashierElement = cashierElement;

    this.#initChilds();

    this.#setCashierListener();
  }

  /**
   * run init in child classes
   * @private
   */
  #initChilds() {
    this.#cashierChild.shortcuts.init();
    this.#cashierChild.paymentDetails.init();
    this.#cashierChild.transactionList.init();
    this.#cashierChild.totalPrice.init();
    this.#cashierChild.notification.init();
    this.#cashierChild.submenu.init();
  }

  /**
   * set listener to cashier
   * @private
   */
  #setCashierListener() {
    // auto add to item if detected string input when cashier focused
    this.cashierElement.addEventListener("keydown", ({ target, key }) => {
      // checking for opened submenus
      const currentSubmenu = this.#cashierChild.submenu.openedSubmenu;

      // focus to searchItem's hint if available
      if (currentSubmenu instanceof SearchItem) {
        currentSubmenu.fixFocus(target);
      }

      if (currentSubmenu instanceof Cancel) {
        currentSubmenu.fixFocus(target);
      }

      // focus to item element as soon as a keyinput inserted
      // or create new transastion if it's completed
      else if (target === this.cashierElement) {
        // regex for: letters and numbers only
        const regex = /^[A-Za-z0-9]*$/;

        if (key.length === 1 && regex.test(key)) {
          this.#cashierChild.transactionList.inputFromCashier();
        }
      }
    });
  }

  /**
   * returns cashierChilds (directly)
   * @type {CashierChilds}
   */
  get childs() {
    // called from almost child classes
    return this.#cashierChild;
  }

  /**
   * returns cashier element
   * @type {HTMLElement}
   */
  get element() {
    // called from children class constructors (transactions, shortcuts, paymentDetails and totalPrice)
    return this.cashierElement;
  }

  /**
   * returns name
   * @type {String}
   */
  get name() {
    return "cashier";
  }

  /**
   * focuses to cashier element
   */
  focus() {
    this.cashierElement.focus();
  }
}

// create cashier UI
const cashierUIElement = document.querySelector(".cashier");
new CashierUI(cashierUIElement);
