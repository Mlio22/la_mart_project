import { BarcodeElement, TextElement, ActionElement, AmountElement } from "./itemElement.js";
import { set_proper_price } from "../../../../../etc/others.mjs";
import { ItemLog } from "../../../../../etc/Log.js";
import { SearchItem } from "../shortcuts-helper/shortcut-objects/searchItem.js";
import { CashierInvoker } from "../../dbInvoker.js";
import { deepEqual } from "../../../../../etc/others.mjs";

const EMPTY_ITEM = {
  id: null,
  barcode: "",
  name: "",
  quantity: "",
  price: 0,
  valid: false,
};

export class Item {
  #dbid = null;
  #itemLog = [];
  #savedItemData = null; // saved item data in DB

  #listElement = null;

  #data;
  #ui;

  constructor(itemList, listElement, data = { ...EMPTY_ITEM }) {
    this.itemList = itemList;
    this.#listElement = listElement;

    this.#gatherTransactionInfo();

    // gathering data
    this.#gatherData(data);

    // add ui class property
    this.#createUi();

    this.#init();
  }

  #gatherTransactionInfo() {
    this.transactionStatus = {
      isWorking: this.itemList.transaction.working,
      isSaved: this.itemList.transaction.saved,
      isCompleted: this.itemList.transaction.completed,
    };
  }

  // gather data if available
  #gatherData(data) {
    this.#data = {
      amount: 1,
      ...data,
    };
  }

  #createUi() {
    console.log("aakjshd");
    // create / restore ui
    this.#ui = new ItemUI(this, this.#listElement, { ...this.#data });
  }

  #init() {
    // setting timeout to fix item's index in itemList
    setTimeout(() => {
      this.itemList.refreshTotalPrice();
      this.#checkData();

      // add ItemLog: item initialized (blank) (10)
      this.#itemLog.push(new ItemLog(10));
    }, 50);
  }

  // for loading previous transaction and restoring completed transaction item
  // called from itemList
  restoreItem() {
    this.#createUi();
    this.#itemLog.push(new ItemLog(11));
  }

  #checkData() {
    // go create new item if enough info in previous item
    if (this.#data.valid) {
      this.#ui.childElements.barcodeElement.lock();
      this.itemList.createNewItem();
    } else {
      this.#ui.childElements.barcodeElement.focus();
    }
  }

  #isItemEmpty() {
    // checking if the #data is the same as EMPTY_ITEM
    return JSON.stringify({ ...this.#data, ...EMPTY_ITEM }) === JSON.stringify(this.#data);
  }

  async checkTransactionStatus() {
    // renew the transaction statusses
    this.#gatherTransactionInfo();

    if (this.transactionStatus.isCompleted) {
      this.#setMaxAmount();
    }
  }

  #setMaxAmount() {
    // setting maxAmount
    const { amount } = this.#data;
    this.#data = {
      maxAmount: amount,
      ...this.#data,
    };

    this.#ui.childElements.amountElement.setMaxAmount();
  }

  deleteThisItem() {
    this.#data.amount = 0;
    this.itemList.removeItemFromList(this);
    this.#ui.removeUi();

    this.itemList.refreshTotalPrice();

    // logging
    // checking if item is blank or not
    if (this.#isItemEmpty()) {
      this.#itemLog.push(new ItemLog(42));
    } else {
      this.#itemLog.push(new ItemLog(this.transactionStatus.isCompleted ? 41 : 40));
    }

    // delete from db if exist in db
    if (this.#dbid) {
      this.#deleteItemDB();
    }

    this.itemList.focusToLatestBarcode();
  }

  increaseAmount(amount = 1) {
    const nextAmount = this.#data.amount + amount;
    this.setSeveralItemData({ amount: nextAmount });
  }

  decreaseAmount(amount = 1) {
    const nextAmount = this.#data.amount - amount;

    if (nextAmount < 1) {
      nextAmount = 1;
    }

    this.setSeveralItemData({ amount: nextAmount });
  }

  setSeveralItemData(newData) {
    // set single or multiple data
    const newDataProperty = { ...this.#data, ...newData };

    // logging
    const logCode = this.transactionStatus.isCompleted ? 31 : 30;

    this.#itemLog.push(
      new ItemLog(logCode, {
        before: { ...this.#data },
        after: { ...newDataProperty },
      })
    );

    this.#data = { ...newDataProperty };
    this.#ui.itemContent = this.#data;

    this.itemList.refreshTotalPrice();
  }

  resetItemData() {
    this.#data = { amount: 1, ...EMPTY_ITEM };
  }

  get data() {
    return this.#data;
  }

  get ui() {
    return this.#ui;
  }

  set data({ data = EMPTY_ITEM, code = null }) {
    // set data absolutely, from e.g. search-item
    // so the data will be always valid
    // unless it's duplicate, it'll be resetted
    // it only needs item id to log
    // function called from search-item

    // logging
    this.#itemLog.push(new ItemLog(code, data));

    const { amount: previousAmount } = this.#data;
    this.#data = Object.assign(data, {
      amount: previousAmount,
    });

    // check duplicate
    this.checkDuplicateFromItem();

    this.#ui.itemContent = this.#data;
    this.#checkData();
  }

  checkDuplicateFromItem() {
    const isDuplicate = this.itemList.checkDuplicateOnList(this);

    if (isDuplicate) {
      // reset to empty item
      this.resetItemData();
    } else {
      this.#data.valid = true;
    }

    return isDuplicate;
  }

  async openSearchFromItem() {
    // exact match search attempt
    const exactMatch = await SearchItem.exactMatch(this.#data.barcode, "cashier");
    if (exactMatch) {
      this.data = { data: exactMatch, code: 21 };
    }

    // search anyways
    else {
      this.itemList.transaction.transactionList.cashier.childs.submenu.openSubmenu("F2", {
        itemReference: this,
        hint: this.#data.barcode,
        type: "cashier",
      });
    }
  }

  async storeItemtoDB() {
    // store to db as new item if #dbid is null
    // update it if has #dbid
    let itemDetail = {
      itemId: this.#data.id,
      amount: this.#data.amount,
      log: this.#itemLog.map((log) => log.log),
    };

    if (this.#dbid) {
      if (!deepEqual(itemDetail, this.#savedItemData)) {
        // update existing transactionItem in database
        await CashierInvoker.storeTransactionItem({
          transactionItemId: this.#dbid,
          data: { ...itemDetail },
        });
      }
    } else {
      // creating new transactionItem in database
      this.#dbid = await CashierInvoker.storeTransactionItem({
        transactionAllId: this.itemList.transaction.id,
        data: { ...itemDetail },
      });
    }

    // save stored data
    this.#savedItemData = { ...itemDetail };
  }

  async #deleteItemDB() {
    let itemDetail = {
      transactionItemId: this.#dbid,
      log: this.#itemLog.map((log) => log.log),
    };

    await CashierInvoker.deleteTransactionItem(itemDetail);
  }
}

class ItemUI {
  #itemContentElement;
  #itemElement;

  constructor(item, listElement, data = { ...EMPTY_ITEM }) {
    this.item = item;
    this.listElement = listElement;

    this.#createElement(data);
  }

  #createElement(data) {
    console.log(this.listElement);
    // create tr element
    this.#itemElement = document.createElement("tr");
    this.#itemElement.className = "purchases-contents";

    // get the required data
    const { name, quantity, price, amount } = data;

    // create child elements
    this.#itemContentElement = {
      actionElement: new ActionElement(this.item),
      barcodeElement: new BarcodeElement(this.item),
      nameElement: new TextElement("name-content", name),
      quantityElement: new TextElement("type-content", quantity),
      priceElement: new TextElement("price-content", set_proper_price(price)),
      amountElement: new AmountElement(this.item),
      totalPriceElement: new TextElement("total-price-content", set_proper_price(price * amount)),
    };

    Object.keys(this.#itemContentElement).forEach((key) => {
      this.#itemElement.appendChild(this.#itemContentElement[key].element);
    });

    this.listElement.appendChild(this.#itemElement);
    console.log(this.#itemElement);
  }

  removeUi() {
    // remove ui from document
    this.#itemElement.remove();
  }

  changeAmount(amount) {
    // above: item
    // below: barcode
    this.#itemContentElement.amountElement.value = amount;
  }

  set itemContent(newItemData) {
    const { name, barcode, quantity, price, amount, valid } = newItemData;
    const {
      actionElement,
      barcodeElement,
      nameElement,
      quantityElement,
      priceElement,
      amountElement,
      totalPriceElement,
    } = this.#itemContentElement;

    // set action to delete if valid
    if (valid) actionElement.ableToDelete();

    barcodeElement.barcode = barcode;
    nameElement.text = name;
    quantityElement.text = quantity;
    priceElement.text = set_proper_price(price);
    amountElement.value = amount;
    totalPriceElement.text = set_proper_price(price * amount);
  }

  get childElements() {
    return this.#itemContentElement;
  }
}
