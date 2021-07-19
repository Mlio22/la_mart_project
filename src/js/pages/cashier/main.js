import { TransactionList } from "./primary/transactionList.js";
import { TotalPrice } from "./primary/totalPrice.js";
// import { Notification } from './ui/notification.js'
import { ShortcutWrapper } from "./primary/shortcutWrapper.js";
import { PaymentDetails } from "./primary/paymentDetails.js";
import { SubmenuWrapper } from "./primary/submenuWrapper.js";

class CashierUI {
  #cashierChild = {};

  constructor(cashierElement) {
    this.cashierElement = cashierElement;

    // visible childs (primary)
    this.#cashierChild.shortcuts = new ShortcutWrapper(this);
    this.#cashierChild.paymentDetails = new PaymentDetails(this);
    this.#cashierChild.transactionList = new TransactionList(this);
    this.#cashierChild.totalPrice = new TotalPrice(this);

    // submenu
    this.#cashierChild.submenu = new SubmenuWrapper(this);

    this.#setCashierListener();
  }

  #setCashierListener() {
    // regex for: letters and numbers only
    const regex = /^[A-Za-z0-9]*$/;
    // auto add to item if detected string input when cashier focused
    this.cashierElement.addEventListener("keydown", ({ target, key }) => {
      if (target === this.cashierElement) {
        if (key.length === 1 && regex.test(key)) {
          this.#cashierChild.transactionList.inputFromCashier(key);
        }
      }
    });
  }

  get childs() {
    // called from almost child classes
    return this.#cashierChild;
  }

  get element() {
    // called from children class constructors (transactions, shortcuts, paymentDetails and totalPrice)
    return this.cashierElement;
  }

  focus() {
    this.cashierElement.focus();
  }
}

const cashierUIElement = document.querySelector(".cashier");

// create cashier UI
new CashierUI(cashierUIElement);
