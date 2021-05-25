import { SubElement } from "./secondary/subElement.js";
import { Transaction } from "./primary/transactions/transaction.js";
// import { Notification } from './ui/notification.js'
// import { Shortcuts } from './ui/shortcuts.js'

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
    this.__notificationElement =
      this.__cashierElement.querySelector(".notification");
    this.__totalPriceElement =
      this.__cashierElement.querySelector(".total-price");
    this.__paymentElement = this.__cashierElement.querySelector(".payment");
    this.__shortcutElement = this.__cashierElement.querySelector(".shortcuts");

    // set submenu class
    this.__submenu = new SubElement(this, this.__submenuCoverElement);

    // set child classes
    this.__transaction = new Transaction(this, this.__itemListElement);

    // this.__notification = new Notification(this, this.__notificationElement);
    // this.__shortcuts = new Shortcuts(this, this.__shortcutElement, this.__submenuCoverElement);

    this.__childComponents = {
      transaction: this.__transaction,
      // 'notification': this.__notification,
      // 'shortcuts': this.__shortcuts
    };
  }

  // function called from child to child through parent

  openSubmenu(name, params) {
    // create submenu
    // used from transation to submenu(search-item)
    this.__submenu.createSubmenu(name, params);
  }

  createNewItem(itemData) {
    // used in submenu(search-item) to transaction
    this.__transaction.createNewItem(itemData);
  }
}

const cashierUIElement = document.querySelector(".cashier");

// create cashier UI
new CashierUI(cashierUIElement);
