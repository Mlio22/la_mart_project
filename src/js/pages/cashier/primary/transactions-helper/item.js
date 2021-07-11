import { BarcodeElement, TextElement, ActionElement, AmountElement } from "./itemElement.js";
import { set_proper_price } from "../../../etc/others.js";

const EMPTY_ITEM = {
  barcode: "",
  name: "",
  quantity: "",
  amount: 1,
  price: 0,
};

export class Item {
  #data;
  #ui;
  #itemOptions;

  constructor(itemList, listElement, data, options = {}) {
    this.itemList = itemList;
    this.#itemOptions = options;

    // gathering data
    this.#gatherData(data);

    // add ui to Html document
    this.#ui = new ItemUI(this, listElement, this.#data);

    // don't refresh and check data if item is being restored
    if (!this.#itemOptions.isRestore) {
      // setting timeout to fix item's index in itemList
      setTimeout(() => {
        this.itemList.refreshTotalPrice();
        this.#checkData();
      }, 50);
    } else {
      // lock the barcode of restored item
      this.#ui.childElements.barcodeElement.lock();
    }
  }

  deleteThisItem() {
    // function only called from action
    this.itemList.removeItemFromList(this);
    this.#ui.removeUi();

    this.itemList.refreshTotalPrice();
  }

  increaseAmount(amount = 1) {
    // function called only from above (itemList)

    // get previous amount
    const previousAmount = this.#data.amount;
    this.setSeveralItemData({ amount: previousAmount + amount });

    // refresh ui
    this.#ui.itemContent = this.#data;
  }

  openSearchFromItem() {
    this.itemList.transaction.transactionList.cashier.childs.submenu.openSubmenu("F2", {
      itemReference: this,
      hint: this.#data.barcode,
    });
  }

  checkDuplicateFromItem() {
    return this.itemList.checkDuplicateOnList(this);
  }

  setSeveralItemData(newData) {
    // set single data
    this.#data = { ...this.#data, ...newData };
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

  #gatherData(data) {
    // variable for check if data is already valid
    let isDataAlreadyValid;

    // default item data
    if (data === undefined) {
      data = { ...EMPTY_ITEM };
      isDataAlreadyValid = false;
    } else {
      isDataAlreadyValid = true;
    }

    this.#data = { ...data };

    // adding other properties
    this.#data = Object.assign(
      {
        amount: 1,
        valid: isDataAlreadyValid,
      },
      this.#data
    );
  }

  get data() {
    return this.#data;
  }

  get ui() {
    return this.#ui;
  }

  set data(data) {
    // set data absolutely, from e.g. search-item
    // so the data will be always valid
    // function called from search-item

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
    this.#itemElement = document.createElement("tr");
    this.#itemElement.className = "purchases-contents";

    const { name, quantity, price, amount } = data;

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

  // method that called from parent
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
