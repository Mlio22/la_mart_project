import { Item } from "./item.js";

const EXAMPLE_ITEM_FROM_SEARCH_ITEM = {
  barcode: "12",
  name: "ABC",
  quantity: "20",
  price: 20000,
  amount: 1,
  valid: true,
};

export class Transaction {
  constructor(cashier, element) {
    this.__cashier = cashier;
    this.__itemElement = element;

    this.__transaction_id = this.__getNewId();
    this.__transaction_status = 1;

    // transaction properties
    this.__totalPrice = 0;
    this.__payedByConsumer = 0;
    this.__transactionChange = 0;
    this.__totalProfit = 0;

    this.__transactionItems = [];
    this.createNewItem(EXAMPLE_ITEM_FROM_SEARCH_ITEM);
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
    }

    // add item if not duplicate (including empty item)
    const newItem = new Item(this, this.__itemElement, itemData);
    this.__transactionItems.push(newItem);
  }

  // check for duplicate items
  checkDuplicateOnList(itemReference) {
    const indexOnList = this.__transactionItems.indexOf(itemReference);

    const duplicatedItemIndex = this.__compareItemWithList(
      itemReference.data,
      indexOnList
    );

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

      const { barcode: barcodeFromList } =
        this.__transactionItems[itemIndex].data;

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

  __deleteThisItemFromTransaction(item) {
    item.removeThisItemFromTransaction();
    this.removeItemFromList(item);
  }

  removeItemFromList(item) {
    const index = this.__transactionItems.indexOf(item);

    if (index !== undefined) {
      this.__transactionItems.splice(index, 1);
    }
  }

  openSearchItem(params) {
    this.__cashier.openSubmenu("search-item", params);
  }

  refreshTotalPrice() {
    let currentTotalPrice = 0;
    this.__transactionItems.forEach((item) => {
      const { valid, price, amount } = item.data;
      if (valid) {
        currentTotalPrice += price * amount;
      }
    });

    this.__cashier.setTotalPrice(currentTotalPrice);
  }
}
