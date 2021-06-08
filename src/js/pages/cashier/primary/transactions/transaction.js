import { Item } from "./item.js";

const TRANSACTION_LOG = [];

export class Transaction {
  constructor(cashier, element) {
    this.__cashier = cashier;
    this.__itemElement = element;

    // transaction properties
    this.__totalPrice = 0;
    this.__payedByConsumer = 0;
    this.__transactionChange = 0;
    this.__totalProfit = 0;

    this.__transactionItems = [];
    this.createNewItem();
  }

  get totalPrice() {
    return this.__totalPrice;
  }

  __getNewId() {
    // todo: get new id using API
  }

  // function called from above and below
  createNewItem(itemData) {
    // above: used in submenu(search-item)
    // below: used in Item

    if (itemData !== undefined) {
      // check if item is already on list
      const itemIndexOnList = this.__compareItemWithList(itemData);

      if (itemIndexOnList >= 0) {
        this.__increaseItemAmount(itemIndexOnList);
        return;
      }

      // add item to latest idle item in list
      this.__transactionItems[this.__transactionItems.length - 1].data = itemData;
    } else {
      // add item if not duplicate (including empty item)
      const newItem = new Item(this, this.__itemElement, itemData);
      this.__transactionItems.push(newItem);
    }

    this.__checkItemToAffectShortcut();
  }

  __checkItemToAffectShortcut() {
    // if any item is enlisted in list
    // shortcut payment, save-transaction, cancel-transaction is available
    // but
    // print-bill (only if a transaction ever finished) will be unavailable

    if (this.__transactionItems.length > 0) {
      if (this.__transactionItems[0].data.valid) {
        this.__cashier.setShortcutAvailability("F4", true);
        this.__cashier.setShortcutAvailability("F6", true);
        this.__cashier.setShortcutAvailability("F9", true);
        this.__cashier.setShortcutAvailability("F10", false);
        // this.__cashier.setShortcutAvailability("F5", false);
      } else {
        this.__cashier.setShortcutAvailability("F4", false);
        this.__cashier.setShortcutAvailability("F6", false);
        this.__cashier.setShortcutAvailability("F9", false);
      }
    }
  }

  // check for duplicate items
  checkDuplicateOnList(itemReference) {
    const indexOnList = this.__transactionItems.indexOf(itemReference);

    const duplicatedItemIndex = this.__compareItemWithList(itemReference.data, indexOnList);

    if (duplicatedItemIndex >= 0) {
      const duplicatedItem = this.__transactionItems[duplicatedItemIndex];
      if (indexOnList <= duplicatedItemIndex) {
        const { amount } = duplicatedItem.data;
        itemReference.increaseAmount(amount);
      } else {
        const { amount } = itemReference.data;
        duplicatedItem.increaseAmount(amount);
      }
      return true;
    }
    return false;
  }

  __compareItemWithList(comparedItemData, indexOnList = null) {
    // return item's amount on list if item data is the same
    // and return false if doesn't
    // compared properties: barcode
    const { barcode: comparedBarcode } = comparedItemData;

    const transactionLength = this.__transactionItems.length;
    for (let itemIndex = 0; itemIndex < transactionLength; itemIndex++) {
      // skips if it's the index
      if (indexOnList === itemIndex) {
        continue;
      }

      const { barcode: barcodeFromList } = this.__transactionItems[itemIndex].data;

      if (comparedBarcode === barcodeFromList) {
        return itemIndex;
      }
    }
    return;
  }

  __increaseItemAmount(itemIndex, amount = 1) {
    // increase the amount / quantity of selected item
    // because of e.g. duplicate item
    this.__transactionItems[itemIndex].increaseAmount(amount);
  }

  removeItemFromList(item) {
    const index = this.__transactionItems.indexOf(item);

    if (index !== undefined) {
      this.__transactionItems.splice(index, 1);
    }

    this.__checkItemToAffectShortcut();
  }

  openSearchItem(params) {
    this.__cashier.openSubmenu("F2", params);
  }

  refreshTotalPrice() {
    let currentTotalPrice = 0;
    this.__transactionItems.forEach((item) => {
      const { valid, price, amount } = item.data;
      if (valid) {
        currentTotalPrice += price * amount;
      }
    });

    // set total price to be check for payment
    this.__totalPrice = currentTotalPrice;
    this.__cashier.setTotalPrice(currentTotalPrice);
  }

  clearTransactionList() {
    // delete all item elements and items in transactionList
    this.__itemElement.innerHTML = EMPTY_TRANSACTION_HTML;
    this.__transactionItems = [];

    this.createNewItem();
  }
}
