import { BarcodeElement, TextElement, ActionElement, AmountElement } from "./itemElement.js";

const EMPTY_ITEM = {
  barcode: "",
  name: "",
  quantity: "",
  amount: 1,
  price: 0,
};

// set ordinary number strings to proper price string
export const set_proper_price = function (value) {
  // if the input was not a string
  value = value.toString();

  String.prototype.insertDot = function (index) {
    // add dot between a string
    if (index > 0) {
      return this.substring(0, index) + "." + this.substr(index);
    }

    return this;
  };

  // added function to reverse a string
  function reverseString(string) {
    let stringArray = string.split("");
    stringArray = stringArray.reverse();

    return stringArray.join("");
  }

  // turn number to string
  let stringValue = value.toString();

  // reverse the string
  stringValue = reverseString(stringValue);

  // add a dot for every 3 digit
  let addedDot = 0;
  for (let index = 0; index < stringValue.length; index++) {
    if (index >= 3 + addedDot * 4) {
      stringValue = stringValue.insertDot(3 + addedDot * 4);
      addedDot += 1;
    }
  }

  // reverse the string again
  stringValue = reverseString(stringValue);

  return stringValue;
};

export class Item {
  #data;
  #ui;

  constructor(transaction, listElement = document.querySelector("table.purchases"), data) {
    this.transaction = transaction;

    // gathering data
    this.#gatherData(data);

    // add ui to Html document
    this.#ui = new ItemUI(this, listElement, this.#data);

    // setting timeout to fix item's index in transaction
    setTimeout(() => {
      this.transaction.refreshTotalPrice();
      this.#checkData();
    }, 50);
  }

  deleteThisItem() {
    // function only called from action
    this.transaction.removeItemFromList(this);
    this.#ui.removeUi();

    this.transaction.refreshTotalPrice();
  }

  increaseAmount(amount = 1) {
    // function called only from above (transaction)

    // get previous amount
    const previousAmount = this.#data.amount;
    this.setSeveralItemData({ amount: previousAmount + amount });

    // refresh ui
    this.#ui.itemContent = this.#data;
  }

  openSearchFromItem() {
    this.transaction.cashier.childs.shortcuts.openSubmenu("F2", {
      itemReference: this,
      hint: this.#data.barcode,
    });
  }

  checkDuplicateFromItem() {
    return this.transaction.checkDuplicateOnList(this);
  }

  setSeveralItemData(newData) {
    // set single data
    this.#data = { ...this.#data, ...newData };
    this.#ui.itemContent = this.#data;

    this.transaction.refreshTotalPrice();
  }

  #checkData() {
    // go create new item if enough info in previous item
    if (this.#data.valid) {
      this.#ui.childElements.barcodeElement.lock();
      this.transaction.createNewItem();
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
    this.#data = Object.assign(this.#data, {
      amount: 1,
      valid: isDataAlreadyValid,
    });
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
