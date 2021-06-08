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
  constructor(cashierElement) {
    this.__cashierElement = cashierElement;

    // submenu Covers
    this.__submenuCoverElement = document.querySelector(".submenuCover");

    // child elements
    this.__itemListElement = this.__cashierElement.querySelector(".purchases");
    this.__notificationElement = this.__cashierElement.querySelector(".notification");
    this.__totalPriceElement = this.__cashierElement.querySelector(".total-price");
    this.__paymentDetailsElement = this.__cashierElement.querySelector(".right-bar .payment");
    this.__shortcutElement = this.__cashierElement.querySelector(".shortcuts");

    // this.__notification = new Notification(this, this.__notificationElement);
    this.__shortcuts = new ShortcutWrapper(this, this.__shortcutElement, this.__submenuCoverElement);
    this.paymentDetails = new PaymentDetails(this.__paymentDetailsElement);

    // set child classes
    this.__transactions = new Transactions(this, this.__itemListElement);
    this.__totalPrice = new TotalPrice(this.__totalPriceElement);

    // set shortcut key listeners
    this.__shortcuts.setCashierShortcutKeys(this.__cashierElement);
  }

  focusToCashier() {
    this.__cashierElement.focus();
  }

  // function called from child to child through parent

  openSubmenu(key, params) {
    // create a submenu
    // used from transation to submenu(search-item)
    this.__shortcuts.openSubmenu(key, params);
  }

  createNewItem(itemData) {
    // used in submenu(search-item) to transaction
    this.__transactions.currentTransactionObject.createNewItem(itemData);
  }

  getTotalPrice() {
    // used in submenu(payment) to transaction
    return this.__transactions.currentTransactionObject.totalPrice;
  }

  setTotalPrice(totalPrice) {
    // refresh the total price content
    this.__totalPrice.totalPrice = totalPrice;
  }

  cancelCurrentTransaction() {
    this.__transactions.cancelCurrentTransaction();
  }

  completeCurrentTransaction(paymentNominals) {
    this.__transactions.completeCurrentTransaction(paymentNominals);
    this.__shortcuts.setShortcutAvailabilty("F2", false);
    this.__shortcuts.setShortcutAvailabilty("F4", false);
    this.__shortcuts.setShortcutAvailabilty("F6", false);
    this.__shortcuts.setShortcutAvailabilty("F9", false);
    this.__shortcuts.setShortcutAvailabilty("F10", true);
    this.__shortcuts.setShortcutAvailabilty("F11", true);
  }

  setShortcutAvailability(shortcutKey, availability) {
    this.__shortcuts.setShortcutAvailabilty(shortcutKey, availability);
  }
}

const cashierUIElement = document.querySelector(".cashier");

// create cashier UI
new CashierUI(cashierUIElement);
