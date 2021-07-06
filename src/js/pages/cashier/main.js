import { Transactions } from "./primary/transactions/transactions.js";
import { TotalPrice } from "./primary/totalPrice.js";
// import { Notification } from './ui/notification.js'
import { ShortcutWrapper } from "./ui/shortcuts.js";
import { PaymentDetails } from "./primary/paymentDetails.js";

class CashierUI {
  /**
   *
   * @param {HTMLElement} cashierElement
   *
   * This Cashier UI class is for connect to subclasses below it
   */

  #cashierChild;

  constructor(cashierElement) {
    this.cashierElement = cashierElement;

    // child elements
    this.#cashierChild = {};

    this.#cashierChild.shortcuts = new ShortcutWrapper(this);
    this.#cashierChild.paymentDetails = new PaymentDetails(this);
    this.#cashierChild.transactions = new Transactions(this);
    this.#cashierChild.totalPrice = new TotalPrice(this);

    // set shortcut key listeners
    // this.__shortcuts.setCashierShortcutKeys(this.cashierElement);
  }
  // todo: buat ready state untuk child dari cashier
  get childs() {
    // called from almost child classes
    return this.#cashierChild;
  }

  get element() {
    // called from children class constructors (transactions, shortcuts, paymentDetails and totalPrice)
    return this.cashierElement;
  }

  focusToCashier() {
    // called at shortcut.hideSubmenu
    this.cashierElement.focus();
  }
}

const cashierUIElement = document.querySelector(".cashier");

// create cashier UI
new CashierUI(cashierUIElement);
