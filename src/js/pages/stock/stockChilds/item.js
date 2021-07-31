import { ActionElement, BarcodeElement, NameElement, PriceElement, NumberElement } from "./itemElements.js";
const ITEMS = [
  {
    barcode: "221",
    name: "sambal ABC",
    quantity: "Botol",
    buyPrice: 20000,
    sellPrice: 21500,
    stock: 10,
  },
  {
    barcode: "222",
    name: "Sambal DEF",
    quantity: "Sachet",
    buyPrice: 2000,
    sellPrice: 2100,
    stock: 30,
  },
];

const findItem = (searchBarcode) => {
  let isPartiallyMatch = false;

  for (const item of ITEMS) {
    if (item.barcode === searchBarcode) {
      return item;
    } else if (item.barcode.includes(searchBarcode)) {
      isPartiallyMatch = true;
    }
  }

  return isPartiallyMatch;
};

export class Item {
  constructor(itemList) {
    this.itemList = itemList;
    this.childElements = {};

    // states
    this.isItemDataSet = false;
    this.isKnownItem = false;

    this.createItemUi();
  }

  createItemUi() {
    this.itemElement = document.createElement("div");
    this.itemElement.className = "stock-contents";

    this.childElements.action = new ActionElement(this);
    this.childElements.barcode = new BarcodeElement(this, "codes content", "stock-code");
    this.childElements.name = new NameElement(this, "names content", "stock-name");
    this.childElements.quantity = new NameElement(this, "quantities content", "stock-quantity");
    this.childElements.buyPrice = new PriceElement(this, "buy-prices content", "stock-buy-price");
    this.childElements.sellPrice = new PriceElement(this, "sell-prices content", "stock-sell-price");
    this.childElements.firstStock = new NumberElement(this, "first-stock content", "first-stock");
    this.childElements.stockIn = new NumberElement(this, "stock-in content", "stock-in");
    this.childElements.stockOut = new NumberElement(this, "stock-out content", "stock-out");

    // append to parent
    this.itemList.itemsElement.appendChild(this.itemElement);

    // focus to barcode
    this.childElements.barcode.focus();
  }

  checkItemOnList(itemData) {
    const newBarcode = itemData.barcode,
      isItemUnique = this.itemList.checkUniqueItem(this, newBarcode);

    return isItemUnique;
  }

  getItemFromDB(barcode) {
    this.setItemToDefaultState();

    const result = findItem(barcode);

    if (typeof result === "object") {
      this.addKnownItem(result);
    } else {
      this.checkNotKnownItem(result);
    }
  }

  addKnownItem(itemData) {
    const itemOnList = this.checkItemOnList(itemData);

    if (itemOnList) {
      // set the current barcode to empty string
      this.childElements.barcode.value = "";

      // focus to duplicated item stock
      itemOnList.focus();

      // add item is already available notification
    } else {
      // set item values
      this.setItemValues(itemData);
    }

    return;
  }

  checkNotKnownItem(isMatchedPartially) {
    if (isMatchedPartially) {
      // open search item
    } else {
      this.isKnownItem = false;
      this.addNewItemData();
    }
  }

  setItemValues(itemData) {
    this.isKnownItem = true;

    const { barcode, name, quantity, buyPrice, sellPrice, stock } = itemData;
    this.childElements.action.able();
    this.childElements.barcode.value = barcode;
    this.childElements.name.value = name;
    this.childElements.quantity.value = quantity;
    this.childElements.buyPrice.value = buyPrice;
    this.childElements.sellPrice.value = sellPrice;
    this.childElements.firstStock.value = stock;
    this.childElements.stockIn.unlock();
    this.childElements.stockOut.unlock();

    if (!this.isItemDataSet) {
      this.isItemDataSet = true;

      // add new item
      this.itemList.addItem();
    }
  }

  addNewItemData() {
    this.childElements.action.able();
    this.childElements.name.unlock();
    this.childElements.quantity.unlock();
    this.childElements.buyPrice.unlock();
    this.childElements.sellPrice.unlock();
    this.childElements.firstStock.unlock();

    // focus to name
    this.childElements.name.focus();
  }

  delete() {
    // remove HTML child
    this.itemElement.remove();

    // remove from list
    this.itemList.removeItem(this);
  }

  focus() {
    // focus to first-stock if it's new item
    // focus to stock-in if it's known item
    // focus to

    if (this.isKnownItem) {
      this.childElements.stockIn.focus();
    } else {
      this.childElements.firstStock.focus();
    }

    if (!this.isItemDataSet) {
      this.childElements.barcode.focus();
    }
  }

  setItemToDefaultState() {
    this.childElements.action.disable();
    this.childElements.barcode.unlock();
    this.childElements.name.lock();
    this.childElements.quantity.lock();
    this.childElements.buyPrice.lock();
    this.childElements.sellPrice.lock();
    this.childElements.firstStock.lock();
    this.childElements.stockIn.lock();
    this.childElements.stockOut.lock();
  }

  get barcode() {
    return this.childElements.barcode.value;
  }
}
