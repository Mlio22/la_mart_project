import {
  ActionElement,
  BarcodeElement,
  NameElement,
  PriceElement,
  NumberElement,
} from "./itemElements.js";
import { SearchItem } from "../../cashier/primary/shortcuts-helper/shortcut-objects/searchItem.js";

export class Item {
  constructor(itemList) {
    this.itemList = itemList;
    this.childElements = {};

    this.barcodeBefore = ""; //needed in checkBarcodeChange()

    // states
    this.isKnownItem = false; // is item new or not

    // isNewBarcodeChanged used for new items
    // if a new item added with a new barcode, then the barcode changes with other new barcode
    // this will trigger this to true
    this.isNewBarcodeChanged = false;

    // isItemDataSet is property to determine that an item's data has been set
    // this including new item or already known item
    // if isItemDataSet, then lock the barcode, name, quantity
    this.isItemDataSet = false;

    // itemData is data's item that gathered from searchItem
    this.searchItemData = null;

    this.#createItemUi();
  }

  #createItemUi() {
    this.itemElement = document.createElement("div");
    this.itemElement.className = "stock-contents";

    this.childElements.action = new ActionElement(this);
    this.childElements.barcode = new BarcodeElement(this, "codes content", "stock-code");
    this.childElements.name = new NameElement(this, "names content", "stock-name");
    this.childElements.quantity = new NameElement(this, "quantities content", "stock-quantity");
    this.childElements.buyPrice = new PriceElement(this, "buy-prices content", "stock-buy-price");
    this.childElements.sellPrice = new PriceElement(
      this,
      "sell-prices content",
      "stock-sell-price"
    );
    this.childElements.firstStock = new NumberElement(this, "first-stock content", "first-stock");
    this.childElements.stockIn = new NumberElement(this, "stock-in content", "stock-in");
    this.childElements.stockOut = new NumberElement(this, "stock-out content", "stock-out");

    // append to parent
    this.itemList.itemsElement.appendChild(this.itemElement);

    // focus to barcode
    this.childElements.barcode.focus();
  }

  openSearchItemWithEmpty() {
    this.itemList.stock.stockChild.submenu.openSubmenu("F2", {
      itemReference: this,
      hint: this.barcodeBefore,
      type: "stock",
    });
  }

  checkBarcodeChange(barcode) {
    if (barcode === this.barcodeBefore) return;
    this.barcodeBefore = barcode;

    // set to try to delete item if barcode is empty
    // and item wasn't new item (mepty item)
    if (barcode === "" && !this.empty) {
      this.delete();
    }

    // exact match search attempt
    const exactMatch = SearchItem.exactMatch(this.barcodeBefore, "stock");
    if (exactMatch) {
      this.knownItem(exactMatch);
    }

    // any match search
    else {
      const isMatchAny = SearchItem.anyMatch(this.barcodeBefore, "stock");

      if (isMatchAny) {
        // open search item
        this.itemList.stock.stockChild.submenu.openSubmenu("F2", {
          itemReference: this,
          hint: this.barcodeBefore,
          type: "stock",
        });
      } else {
        this.unknownItem();
      }
    }
  }

  knownItem(itemData) {
    // set item values
    this.#setItemValues(itemData);

    // check if item is duplicated or not
    const itemOnList = this.itemList.getDuplicatedItem(this);

    if (itemOnList) {
      // delete this item
      this.delete();

      // focus to duplicated item stock
      itemOnList.focus();

      //todo: add item is already available notification
    } else {
      this.isKnownItem = true;
      this.isNewBarcodeChanged = false;

      // focus to stock in
      this.childElements.stockIn.focus();
    }
  }

  #setItemValues(itemData) {
    const { barcode, name, quantity, buyPrice, sellPrice, stock } = itemData;
    this.searchItemData = itemData;

    this.childElements.action.able();
    this.childElements.barcode.value = barcode;
    this.childElements.name.value = name;
    this.childElements.quantity.value = quantity;
    this.childElements.buyPrice.value = buyPrice;
    this.childElements.sellPrice.value = sellPrice;
    this.childElements.firstStock.value = stock;
    this.childElements.stockIn.unlock();
    this.childElements.stockOut.unlock();

    // set values to stock-in/out to 0
    this.childElements.stockIn.value = 0;
    this.childElements.stockOut.value = 0;

    if (!this.isItemDataSet) {
      this.isItemDataSet = true;

      // add new item
      this.itemList.checkItemList();
    }
  }

  unknownItem() {
    // check for duplicated item
    const itemOnList = this.itemList.getDuplicatedItem(this);

    if (itemOnList) {
      this.delete();
      itemOnList.focus();
    } else {
      this.isKnownItem = false;
      this.#setInputStatesForNewItem();

      // if new barcode has been changed before, let the other input values
      // otherwise, set setNewItemStarterValues() for starter input values
      if (this.isNewBarcodeChanged) {
        // focus to name
        this.childElements.name.focus();
      } else {
        this.isNewBarcodeChanged = true;
        this.#setNewItemStarterValues();

        // add new item
        this.itemList.checkItemList();
      }

      this.childElements.name.focus();
    }
  }

  #setInputStatesForNewItem() {
    this.childElements.action.able();
    this.childElements.name.unlock();
    this.childElements.quantity.unlock();
    this.childElements.buyPrice.unlock();
    this.childElements.sellPrice.unlock();
    this.childElements.firstStock.unlock();
  }

  #setNewItemStarterValues() {
    this.childElements.firstStock.value = 1;
    this.childElements.buyPrice.value = 0;
    this.childElements.sellPrice.value = 0;
  }

  setItemToDefaultState() {
    this.#clearElementInputs();
    this.#setElementDefaultState();
  }

  #clearElementInputs() {
    // clear the input values
    this.childElements.barcode.value = "";
    this.childElements.name.value = "";
    this.childElements.quantity.value = "";
    this.childElements.buyPrice.value = "";
    this.childElements.sellPrice.value = "";
    this.childElements.firstStock.value = "";
    this.childElements.stockIn.value = "";
    this.childElements.stockOut.value = "";
  }

  #setElementDefaultState() {
    // set the inputs state
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

  getItemDatas() {
    return {
      isKnownItem: this.isKnownItem,
      previousItemData: this.searchItemData,
      itemData: {
        barcode: this.childElements.barcode.value,
        name: this.childElements.name.value,
        quantity: this.childElements.quantity.value,
        buyPrice: this.childElements.buyPrice.value,
        sellPrice: this.childElements.sellPrice.value,
        firstStock: this.childElements.firstStock.value,
        stockIn: this.childElements.stockIn.value,
        stockOut: this.childElements.stockOut.value,
      },
    };
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

  get empty() {
    // if item data not set (known item) nor barcode not changed (unknown item)
    // then it is an empty item
    return !this.isItemDataSet && !this.isNewBarcodeChanged;
  }

  get barcode() {
    return this.childElements.barcode.value;
  }
}
