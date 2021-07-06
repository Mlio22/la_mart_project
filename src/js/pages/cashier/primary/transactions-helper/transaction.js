import { Item } from "./item.js";

const TRANSACTION_LOG = [];

// Status list:
// 1 : working
// 2 : saved
// 3 : completed
// 4 : cancelled

export class Transaction {
  #transactionItems = [];

  // transaction properties
  #transactionInfo = {
    id: 1, // create get id function
    status: 1,
    cash: {
      totalPrice: 0,
      paidbyCustomer: null,
      change: null,
      profit: 0,
    },
  };

  constructor(cashier, element) {
    this.cashier = cashier;
    this.itemElement = element;

    // creates new item in list
    this.createNewItem();
  }

  // function called from above and below
  createNewItem(itemData) {
    // above: used in submenu(search-item)
    // below: used in Item

    if (itemData !== undefined) {
      // check if item is already on list
      const itemIndexOnList = this.#returnItemWithSameBarcode(itemData);

      if (itemIndexOnList !== -1) {
        console.log(itemIndexOnList);
        // increase the amount
        this.#transactionItems[itemIndexOnList].increaseAmount(1);
      } else {
        // add item to latest empty item in list
        this.#transactionItems[this.#transactionItems.length - 1].data = itemData;
      }
    } else {
      // add item if not duplicate (including empty item)
      const newItem = new Item(this, this.itemElement, itemData);
      this.#transactionItems.push(newItem);
    }

    this.#checkItemToAffectShortcut();
  }

  // check for duplicate items
  checkDuplicateOnList(itemReference) {
    // called from item, itemElement
    const indexOnList = this.#transactionItems.indexOf(itemReference);
    const duplicatedItemIndex = this.#returnItemWithSameBarcode(itemReference.data, indexOnList);

    if (duplicatedItemIndex >= 0) {
      const duplicatedItem = this.#transactionItems[duplicatedItemIndex];
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

  removeItemFromList(item) {
    const index = this.#transactionItems.indexOf(item);

    if (index !== -1) {
      this.#transactionItems.splice(index, 1);
    }

    this.#checkItemToAffectShortcut();
  }

  refreshTotalPrice() {
    // called from item
    let currentTotalPrice = 0;
    this.#transactionItems.forEach((item) => {
      const { valid, price, amount } = item.data;
      if (valid) {
        currentTotalPrice += price * amount;
      }
    });

    // set total price to be check for payment
    this.#transactionInfo.cash.totalPrice = currentTotalPrice;
    this.cashier.childs.totalPrice.totalPrice = currentTotalPrice;
  }

  restoreTransactionItems() {
    // !
    // called from transactions
    // used when a transaction load, to restore saved items on that transaction
  }

  focusToLatestBarcode() {
    this.#transactionItems[this.#transactionItems.length - 1].ui.childElements.barcodeElement.focus();
  }

  #checkItemToAffectShortcut() {
    // if any item is enlisted in list
    // shortcut payment, save-transaction, cancel-transaction is available
    // but
    // print-bill (only if a transaction ever finished) will be unavailable
    console.log(this.cashier);

    if (this.#transactionItems.length > 0) {
      if (this.#transactionItems[0].data.valid) {
        this.cashier.childs.shortcuts.setShortcutAvailability({
          F4: true,
          F6: true,
          F9: true,
          F10: false,
          // F5: false,
        });
      } else {
        this.cashier.childs.shortcuts.setShortcutAvailability({
          F4: false,
          F6: false,
          F9: false,
        });
      }
    }
  }

  #returnItemWithSameBarcode(comparedItemData, indexOnList = null) {
    // return item's amount on list if item data is the same
    // and return false if doesn't
    // compared properties: barcode
    const { barcode: comparedBarcode } = comparedItemData;

    const transactionLength = this.#transactionItems.length;
    for (let itemIndex = 0; itemIndex < transactionLength; itemIndex++) {
      // skips if it's the index
      if (indexOnList === itemIndex) {
        continue;
      }

      // compare with barcode
      const { barcode: barcodeFromList } = this.#transactionItems[itemIndex].data;

      if (comparedBarcode === barcodeFromList) {
        return itemIndex;
      }
    }
    return -1;
  }

  get totalPrice() {
    return this.#transactionInfo.cash.totalPrice;
  }

  get transactionId() {
    return this.#transactionInfo.id;
  }

  set status(status) {
    this.#transactionInfo.status = status;
  }
}
