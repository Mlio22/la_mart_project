import { TransactionList } from "./primary/transactionList.js";
import { TotalPrice } from "./primary/totalPrice.js";
// import { Notification } from './ui/notification.js'
import { ShortcutWrapper } from "./primary/shortcutWrapper.js";
import { PaymentDetails } from "./primary/paymentDetails.js";
import { SubmenuWrapper } from "./primary/submenuWrapper.js";

/**
 * @typedef CashierChilds
 * @property {ShortcutWrapper} shortcuts
 * @property {PaymentDetails} paymentDetails
 * @property {TransactionList} transactionList
 * @property {TotalPrice} totalPrice
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
    this.#cashierChild.submenu.init();
  }

  /**
   * set listener to cashier
   * @private
   */
  #setCashierListener() {
    // auto add to item if detected string input when cashier focused
    this.cashierElement.addEventListener("keydown", ({ target, key }) => {
      // regex for: letters and numbers only
      const regex = /^[A-Za-z0-9]*$/;

      if (target === this.cashierElement) {
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
