import { Transaction } from "./primary/transactions/transaction.js";
import { TotalPrice } from "./primary/totalPrice.js";
// import { Notification } from './ui/notification.js'
import { Shortcuts } from "./ui/shortcuts.js";

class CashierUI {
  /**
   *
   * @param {HTMLElement} cashierElement
   *
   * This Cashier UI class is for connect to subclasses below it
   */
  constructor(cashierElement) {
    this.__cashierElement = cashierElement;

    // submenu Covers
    this.__submenuCoverElement = document.querySelector(".submenuCover");

    // child elements
    this.__itemListElement = this.__cashierElement.querySelector(".purchases");
    this.__notificationElement = this.__cashierElement.querySelector(".notification");
    this.__totalPriceElement = this.__cashierElement.querySelector(".total-price");
    this.__paymentElement = this.__cashierElement.querySelector(".payment");
    this.__shortcutElement = this.__cashierElement.querySelector(".shortcuts");

    // set child classes
    this.__transaction = new Transaction(this, this.__itemListElement);
    this.__totalPrice = new TotalPrice(this.__totalPriceElement);

    // this.__notification = new Notification(this, this.__notificationElement);
    this.__shortcuts = new Shortcuts(this, this.__shortcutElement, this.__submenuCoverElement);
  }

  // function called from child to child through parent

  openSubmenu(name, params) {
    // create a submenu
    // used from transation to submenu(search-item)
    this.__shortcuts.openShortcut(name, params);
  }

  createNewItem(itemData) {
    // used in submenu(search-item) to transaction
    this.__transaction.createNewItem(itemData);
  }

  getTotalPrice() {
    // used in submenu(payment) to transaction
    return this.__transaction.totalPrice;
  }

  setTotalPrice(totalPrice) {
    // refresh the total price content
    this.__totalPrice.totalPrice = totalPrice;
  }
}

const cashierUIElement = document.querySelector(".cashier");

// create cashier UI
new CashierUI(cashierUIElement);
