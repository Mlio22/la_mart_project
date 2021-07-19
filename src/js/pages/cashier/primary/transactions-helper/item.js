import { BarcodeElement, TextElement, ActionElement, AmountElement } from "./itemElement.js";
import { set_proper_price } from "../../../etc/others.js";
import { ItemLog } from "../../../etc/Log.js";

const EMPTY_ITEM = {
  barcode: "",
  name: "",
  quantity: "",
  price: 0,
  valid: false,
};

export class Item {
  #itemLog = [];

  #data;
  #ui;
  #transactionStatus;

  constructor(itemList, listElement, data = { ...EMPTY_ITEM }) {
    this.itemList = itemList;
    this.#transactionStatus = {
      isWorking: this.itemList.transaction.working,
      isSaved: this.itemList.transaction.saved,
      isCompleted: this.itemList.transaction.completed,
    };

    // gathering data
    this.#gatherData(data);

    // add ui class property
    this.#ui = new ItemUI(this, listElement, { ...this.#data });

    this.#restoreOrStartUsual();
  }

  // gather data if available
  #gatherData(data) {
    this.#data = {
      amount: 1,
      ...data,
    };
  }

  #restoreOrStartUsual() {
    if (this.#transactionStatus.isWorking) {
      // setting timeout to fix item's index in itemList
      setTimeout(() => {
        this.itemList.refreshTotalPrice();
        this.#checkData();

        // add ItemLog: item initialized (blank) (10)
        this.#itemLog.push(new ItemLog(10));
      }, 50);
    }

    // for loading previous transaction and restoring completed transaction
    else {
      //! don't refresh and check data if item is being restored
      // add ItemLog: Item Restored (11)
      this.#itemLog.push(new ItemLog(11));
    }
  }

  #isItemEmpty() {
    // checking if the #data is the same as EMPTY_ITEM
    return JSON.stringify({ ...this.#data, ...EMPTY_ITEM }) === JSON.stringify(this.#data);
  }

  deleteThisItem() {
    this.itemList.removeItemFromList(this);
    this.#ui.removeUi();

    this.itemList.refreshTotalPrice();

    // logging
    // checking if item is blank or not
    if (this.#isItemEmpty()) {
      this.#itemLog.push(new ItemLog(42));
    } else {
      this.#itemLog.push(new ItemLog(this.#transactionStatus.isCompleted ? 41 : 40));
    }
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
    const logCode = this.#transactionStatus.isCompleted ? 31 : 30;

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

  #checkData() {
    // go create new item if enough info in previous item
    if (this.#data.valid) {
      this.#ui.childElements.barcodeElement.lock();
      this.itemList.createNewItem();
    } else {
      this.#ui.childElements.barcodeElement.focus();
    }
  }

  get data() {
    return this.#data;
  }

  get ui() {
    return this.#ui;
  }

  set data({ data, code = null }) {
    // set data absolutely, from e.g. search-item
    // so the data will be always valid
    // function called from search-item

    // logging
    this.#itemLog.push(new ItemLog(code, data));

    const { amount: previousAmount } = this.#data;
    this.#data = Object.assign(data, {
      amount: previousAmount,
    });

    const isDuplicate = this.checkDuplicateFromItem();

    if (isDuplicate) {
      // reset to empty item
      this.#data = { ...EMPTY_ITEM };
    } else {
      this.#data.valid = true;
    }

    this.#ui.itemContent = this.#data;
    this.#checkData();
  }

  checkDuplicateFromItem() {
    return this.itemList.checkDuplicateOnList(this);
  }

  openSearchFromItem() {
    this.itemList.transaction.transactionList.cashier.childs.submenu.openSubmenu("F2", {
      itemReference: this,
      hint: this.#data.barcode,
    });
  }

  itemTransactionCompleted() {
    this.#transactionStatus.isCompleted = true;

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

    actionElement.deletable = valid;
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
