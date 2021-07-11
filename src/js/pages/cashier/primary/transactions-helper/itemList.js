import { Item } from "./item.js";

// Status list:
// 1 : working
// 2 : saved
// 3 : completed
// 4 : cancelled

export class ItemList {
  #items = [];

  constructor(transaction) {
    this.transaction = transaction;
    this.itemElement = transaction.transactionList.cashier.element.querySelector("table.purchases");

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
        this.#items[itemIndexOnList].increaseAmount(1);
      } else {
        // add item to latest empty item in list
        this.#items[this.#items.length - 1].data = itemData;
      }
    } else {
      // add item if not duplicate (including empty item)
      const newItem = new Item(this, this.itemElement, itemData);
      this.#items.push(newItem);
    }

    this.#checkItemToAffectShortcut();
  }

  // check for duplicate items
  checkDuplicateOnList(itemReference) {
    // called from item, itemElement
    const indexOnList = this.#items.indexOf(itemReference);
    const duplicatedItemIndex = this.#returnItemWithSameBarcode(itemReference.data, indexOnList);

    if (duplicatedItemIndex >= 0) {
      const duplicatedItem = this.#items[duplicatedItemIndex];
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
    const index = this.#items.indexOf(item);

    if (index !== -1) {
      this.#items.splice(index, 1);
    }

    this.#checkItemToAffectShortcut();
  }

  refreshTotalPrice() {
    // called from item
    let currentTotalPrice = 0;
    this.#items.forEach((item) => {
      const { valid, price, amount } = item.data;
      if (valid) {
        currentTotalPrice += price * amount;
      }
    });

    // set total price to be check for payment
    this.transaction.cashInfo = { totalPrice: currentTotalPrice };
    this.transaction.transactionList.cashier.childs.totalPrice.totalPrice = currentTotalPrice;
  }

  removeLastEmptyItem() {
    this.removeItemFromList(this.#items.splice(this.#items.length - 1, 1));
  }

  restoreItemList(readonly = false) {
    this.#items = this.#items.map((item) => new Item(this, this.itemElement, item.data, { isRestore: true, readonly }));
  }

  focusToLatestBarcode() {
    this.#items[this.#items.length - 1].ui.childElements.barcodeElement.focus();
  }

  #checkItemToAffectShortcut() {
    // if any item is enlisted in list
    // shortcut payment, save-transaction, cancel-transaction is available
    // but
    // print-bill (only if a transaction ever finished) will be unavailable

    if (this.#items.length > 0) {
      if (this.#items[0].data.valid) {
        this.transaction.transactionList.cashier.childs.shortcuts.setShortcutAvailability({
          F4: true,
          F6: true,
          F9: true,
          F10: false,
        });
      } else {
        this.transaction.transactionList.cashier.childs.shortcuts.setShortcutAvailability({
          F4: false,
          F6: false,
          F5: false,
          F9: false,
          F10: true,
        });
      }
    }
  }

  #returnItemWithSameBarcode(comparedItemData, indexOnList = null) {
    // return item's amount on list if item data is the same
    // and return false if doesn't
    // compared properties: barcode
    const { barcode: comparedBarcode } = comparedItemData;

    const transactionLength = this.#items.length;
    for (let itemIndex = 0; itemIndex < transactionLength; itemIndex++) {
      // skips if it's the index
      if (indexOnList === itemIndex) {
        continue;
      }

      // compare with barcode
      const { barcode: barcodeFromList } = this.#items[itemIndex].data;

      if (comparedBarcode === barcodeFromList) {
        return itemIndex;
      }
    }
    return -1;
  }

  get items() {
    return this.#items;
  }
}
