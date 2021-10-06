/**
 * @typedef {import('./transaction').Transaction} Transaction
 * @typedef {import('./item').ItemData} ItemData
 */

import { Item } from "./item.js";

// Status list:
// 1 : working
// 2 : saved
// 3 : completed
// 4 : cancelled

export class ItemList {
  /**
   * lists of items
   * @type {Array<Item>}
   * @private
   */
  #items = [];

  /**
   * @type {Boolean}
   * @private
   */
  #isTransactionCompleted = false;

  /**
   *
   * @param {Transaction} transaction
   * @param {(ItemData | undefined)} [starterItemData]
   */
  constructor(transaction, starterItemData) {
    this.transaction = transaction;
    this.itemElement = transaction.transactionList.cashier.element.querySelector("table.purchases");

    this.#isTransactionCompleted = this.transaction.completed;

    // creates new item in list
    this.createNewItem(starterItemData);
  }

  /**
   * creates new item
   * @param {(ItemData | undefined)} itemData
   */
  createNewItem(itemData) {
    if (this.#isTransactionCompleted) {
      // if transaction is already completed, but an item added from search item (shortcut)
      // start a new transaction and add that item to it
      this.transaction.transactionList.createTransaction(itemData);
    }

    // check if item is already on list
    else if (itemData !== undefined && this.items.length > 0) {
      const itemIndexOnList = this.#duplicateItemIndexBarcode(itemData);

      if (itemIndexOnList !== -1) {
        // increase the amount
        this.#items[itemIndexOnList].increaseAmount(1);
      } else {
        // add item to latest empty item in list
        this.#items[this.#items.length - 1].data = { data: itemData, code: 22 };
      }
    }

    // add item if not duplicate (including empty item)
    else {
      const newItem = new Item(this, this.itemElement, itemData);
      this.#items.push(newItem);
    }

    this.#checkItemToAffectShortcut();
  }

  // check for duplicate items
  /**
   *
   * @param {Item} itemReference
   * @returns {(Item | Boolean)} - duplicated item or false
   */
  checkDuplicateOnList(itemReference) {
    // called from item, itemElement
    const indexOnList = this.#items.indexOf(itemReference);
    const duplicatedItemIndex = this.#duplicateItemIndexBarcode(itemReference.data, indexOnList);

    if (duplicatedItemIndex >= 0) {
      // add the same amount of new item to duplicated item
      const duplicatedItem = this.#items[duplicatedItemIndex];
      return duplicatedItem;
    }
    return false;
  }

  /**
   * removes item from list
   * @param {Item} item
   */
  removeItemFromList(item) {
    // search the item in list and delete it
    const itemIndex = this.#items.indexOf(item);
    if (itemIndex !== -1) {
      this.#items.splice(itemIndex, 1);
    }

    // when transaction is already completed and itemlist is none, start other transaction
    if (this.#isTransactionCompleted && this.#items.length === 0) {
      this.transaction.transactionList.cancelCurrentTransaction();
    } else {
      this.#checkItemToAffectShortcut();
    }
  }

  /**
   * refreshes total price element
   */
  refreshTotalPrice() {
    const currentTotalPrice = this.totalPrice;

    // set total price to be check for payment
    this.transaction.cashInfo = { totalPrice: currentTotalPrice };
    this.transaction.transactionList.cashier.childs.totalPrice.totalPrice = currentTotalPrice;
  }

  /**
   * removes last empty item
   * used when a transaction completes
   */
  removeLastEmptyItem() {
    this.#items[this.#items.length - 1].deleteThisItem();
  }

  /**
   * restore item list
   * for saved transaction or completed transaction
   */
  restoreItemList() {
    // recreate all items UI
    this.#items.forEach((item) => item.restoreItem());

    // add new item if transaction is saved
    if (this.transaction.saved) {
      this.createNewItem();
    }

    // refreshes totalprice element if completed
    if (this.transaction.completed) {
      this.refreshTotalPrice();
    }
  }

  /**
   * focus to latest barcode of items in item list
   */
  focusToLatestBarcode() {
    this.#items[this.#items.length - 1].ui.childElements.barcodeElement.focus();
  }

  /**
   * this only called once when transaction is completed
   * because a completed cannot be set again to working / saved
   */
  setToTransactionCompletedState() {
    this.#isTransactionCompleted = true;
    this.#checkItemToAffectShortcut();

    // recheck the transaction status in items
    this.#items.forEach((item) => item.checkTransactionStatus());
  }

  /**
   * command all items to store its data to DN
   * @async
   */
  async storeItemsToDB() {
    for await (const item of this.#items) {
      await item.storeItemtoDB();
    }
  }

  /**
   * command all items to delete its data from DB
   * @async
   */
  async deleteItemsFromDB() {
    this.#items.forEach(async (item) => {
      await item.deleteItemDB();
    });
  }

  /**
   * refresh shortcut
   * @private
   */
  #checkItemToAffectShortcut() {
    // if any item is enlisted in list
    // shortcut payment, save-transaction, cancel-transaction is available
    // but print-bill (only if a transaction ever finished) will be unavailable

    let shortcutAvaiilabilties = {
      F4: false,
      F5: false,
      F6: false,
      F9: false,
      F10: false,
      F11: false,
    };

    // get for F4
    // if any item exists (not empty item)
    if (this.#items.length > 1) {
      // if last item before empty item is valid
      const lastItemIndex = this.#items.length - 2;

      if (this.#items[lastItemIndex].data.valid) {
        // if transaction not completed yet
        if (!this.#isTransactionCompleted) {
          shortcutAvaiilabilties.F4 = true;
        }
      }
    }

    // get for F5
    if (this.#isTransactionCompleted) shortcutAvaiilabilties.F5 = true;

    // get for F6
    // if any item exists (not empty item)
    if (this.#items.length > 1) {
      // true if transaction is not completed
      if (!this.#isTransactionCompleted) shortcutAvaiilabilties.F6 = true;
    }

    // get for F9
    // if there's an item (working)
    // or transaction is completed
    if (this.#items.length > 1) {
      // if last item before empty item is valid
      const lastItemIndex = this.#items.length - 2;

      if (this.#items[lastItemIndex].data.valid) {
        shortcutAvaiilabilties.F9 = true;
      }
    }
    if (this.#isTransactionCompleted) shortcutAvaiilabilties.F9 = true;

    // get for F10
    // if item is only one and its empty
    // or that transaction is completed
    if (this.#items.length == 1 && this.#items[0].isItemEmpty) shortcutAvaiilabilties.F10 = true;
    if (this.#isTransactionCompleted) shortcutAvaiilabilties.F10 = true;

    // get for F11
    // only if transaction is completed
    if (this.#isTransactionCompleted) shortcutAvaiilabilties.F11 = true;

    this.transaction.transactionList.cashier.childs.shortcuts.setShortcutAvailability(
      shortcutAvaiilabilties
    );
  }

  /**
   * returns duplicated item index if has the same barcode
   * and return false if doesn't
   * compared properties: barcode
   *
   * @param {ItemData} comparedItemData - item's data
   * @param {?number} indexOnList - item's index in list (if any)
   * @returns {(number | boolean)}
   */
  #duplicateItemIndexBarcode(comparedItemData, indexOnList = null) {
    const { barcode: comparedBarcode } = comparedItemData;

    const transactionLength = this.#items.length;
    for (let itemIndex = 0; itemIndex < transactionLength; itemIndex++) {
      // skips if it its (comparedItemData's) index
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

  /**
   * @type {Array<Item>}
   */
  get items() {
    return this.#items;
  }

  /**
   * @type {Number}
   */
  get itemCount() {
    return this.#items.length;
  }

  /**
   * accumulates all valid item prices and returns it
   * @type {Number}
   */
  get totalPrice() {
    let currentTotalPrice = 0;

    this.#items.forEach((item) => {
      const { valid, price, amount } = item.data;
      if (valid) {
        currentTotalPrice += price * amount;
      }
    });

    return currentTotalPrice;
  }
}
