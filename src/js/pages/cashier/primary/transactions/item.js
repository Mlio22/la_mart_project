const set_proper_price = function (value) {
  // added function to add dot between a string
  String.prototype.insertDot = function (index) {
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
  constructor(transaction, listElement, data) {
    // default item data
    const EMPTY_ITEM = {
      barcode: "",
      name: "",
      quantity: "",
      price: 0,
    };

    if (data === undefined) data = EMPTY_ITEM;
    // data untuk jika item dipanggil dari search item
    this.__transaction = transaction;
    this.__listElement = listElement;
    this.__data = data;

    // check if data is already valid
    const isDataAlreadyValid = data !== EMPTY_ITEM;

    this.__data = data;
    this.__data = Object.assign(this.__data, {
      amount: 1,
      valid: isDataAlreadyValid,
    });

    this.__ui = new ItemUI(this, this.__listElement, this.__data);

    // setting timeout to fix item's index in transaction
    setTimeout(() => {
      this.__checkData();
    }, 50);
  }

  // data getter and setter

  get data() {
    return this.__data;
  }

  __checkData() {
    // go create new item if enough info in previous item
    if (this.__data.valid) {
      this.__ui.lockBarcode();
      this.__transaction.createNewItem();
    } else {
      this.__ui.focusBarcode();
    }
  }

  deleteThisItemFromAction() {
    // function only called from action
    this.__transaction.removeItemFromList(this);
    this.__ui.removeUi();
  }

  set data(data) {
    const EMPTY_ITEM = {
      barcode: "",
      name: "",
      quantity: "",
      price: 0,
      amount: 1,
      valid: false,
    };

    // set data absolutely, from e.g. search-item
    // so the data will be always valid
    // function called from search-item
    const { amount: previousAmount } = this.__data;
    this.__data = Object.assign(data, {
      amount: previousAmount,
      valid: true,
    });

    const isDuplicate = this.__transaction.checkDuplicateOnList(this);

    if (isDuplicate) {
      this.__data = EMPTY_ITEM;
    }

    this.__ui.itemContent = this.__data;
    this.__checkData();
  }

  checkDuplicateOnList() {
    return this.__transaction.checkDuplicateOnList(this);
  }

  increaseAmount(amount) {
    // function called only from above (transaction)
    this.__data.amount += amount;
    this.__ui.itemContent = this.__data;
  }

  openSearchItem() {
    this.__transaction.openSearchItem({
      itemReference: this,
      hint: this.__data.barcode,
    });
  }

  setSingleData(dataType, value) {
    // function only called from below (barcode, amount)
    this.__data[dataType] = value;
    this.__ui.itemContent = this.__data;
  }
}

class ItemUI {
  constructor(item, listElement, firstUiValue) {
    this.__item = item;
    this.__listElement = listElement;

    this.__createElement(firstUiValue);
  }

  __createElement(firstUiValue) {
    this.__itemElement = document.createElement("tr");
    this.__itemElement.className = "purchases-contents active";

    const { name, quantity, price, amount } = firstUiValue;

    this.__itemContentElement = {
      actionElement: new ActionElement(this.__item, this),
      barcodeElement: new BarcodeElement(this.__item, this),
      nameElement: new TextElement("name-content", name),
      quantityElement: new TextElement("type-content", quantity),
      priceElement: new TextElement("price-content", set_proper_price(price)),
      amountElement: new AmountElement(this.__item, this),
      totalPriceElement: new TextElement(
        "total-price-content",
        set_proper_price(price * amount)
      ),
    };

    Object.keys(this.__itemContentElement).forEach((key) => {
      this.__itemElement.appendChild(this.__itemContentElement[key].element);
    });

    this.__listElement.appendChild(this.__itemElement);
  }

  // method that called from parent
  removeUi() {
    // remove ui from document
    this.__itemElement.remove();
  }

  focusBarcode() {
    // focus to barcode
    // function called from item
    this.__itemContentElement.barcodeElement.focus();
  }

  lockBarcode() {
    this.__itemContentElement.barcodeElement.lock();
  }

  changeAmount(amount) {
    // above: item
    // below: barcode
    this.__itemContentElement.amountElement.amount = amount;
  }

  set itemContent(itemContent) {
    const { name, barcode, quantity, price, amount, valid } = itemContent;
    const {
      actionElement,
      barcodeElement,
      nameElement,
      quantityElement,
      priceElement,
      totalPriceElement,
    } = this.__itemContentElement;

    barcodeElement.barcode = barcode;
    actionElement.deletable = valid;
    nameElement.text = name;
    quantityElement.text = quantity;
    priceElement.text = set_proper_price(price);
    totalPriceElement.text = set_proper_price(price * amount);

    this.changeAmount(amount);
  }
}

class ActionElement {
  constructor(item, itemUi) {
    this.__item = item;
    this.__itemUi = itemUi;

    this.__isDeletable = this.__item.data.valid;

    // local properties
    this.__createActionElement();
    this.__listenAction();
  }

  __createActionElement() {
    this.__actionWrapper = document.createElement("td");
    this.__actionWrapper.className = `purchases-content action-content no-input`;

    this.__actionButton = document.createElement("button");
    this.__actionButton.innerHTML = `<i class="fas fa-times "></i>`;
    this.__setButtonAblity();

    this.__actionWrapper.appendChild(this.__actionButton);
  }

  __setButtonAblity() {
    // item can be deleted if it's deletable (valid)
    // set button disablity
    this.__actionButton.disabled = !this.__isDeletable;

    // set button disablity class
    if (this.__isDeletable) {
      this.__actionButton.classList.remove("disabled");
    } else {
      this.__actionButton.classList.add("disabled");
    }
  }

  __listenAction() {
    this.__actionWrapper.addEventListener("click", () => {
      if (this.__isDeletable) {
        // delete the item if data is valid and button is clicked
        this.__deleteThisItemFromAction();
      }
    });
  }

  get element() {
    return this.__actionWrapper;
  }

  // to item function
  __deleteThisItemFromAction() {
    // delete item through transaction
    this.__item.deleteThisItemFromAction();
  }

  set deletable(isDeletable) {
    this.__isDeletable = isDeletable;
    this.__setButtonAblity();
  }
}

// Barcode element
class BarcodeElement {
  constructor(item, itemUi) {
    this.__item = item;
    this.__itemUi = itemUi;

    const firstBarcode = this.__item.data.barcode;

    this.__createBarcodeElement(firstBarcode);
  }

  // local related methods
  __createBarcodeElement(barcode) {
    // the wrapper element
    this.__barcodeWrapper = document.createElement("td");
    this.__barcodeWrapper.className = "purchases-content barcode-content";

    // the input element
    this.__barcodeElement = document.createElement("input");
    this.__barcodeElement.type = "text";
    this.__barcodeElement.value = barcode;

    // listen to the input
    this.__listenBarcode();

    this.__barcodeWrapper.appendChild(this.__barcodeElement);
  }

  __listenBarcode() {
    // if barcode is changed,
    // first, look for duplicate item on the list,
    // if it's not duplicate, then check to DB with search-item

    // if search-item is succeed, search-item will change the item data
    // else if search-item is closed, change item data and set validity to false
    this.__barcodeElement.addEventListener("change", (e) => {
      const barcodeValue = e.target.value;

      if (barcodeValue.length > 1) {
        this.__item.setSingleData("barcode", barcodeValue);
        const isDuplicate = this.__item.checkDuplicateOnList();

        if (isDuplicate) {
          // if duplicate, then clear the barcode and set amount to 1
          this.__barcodeElement.value = "";
          this.focus();
        } else {
          console.log("opening search item");
          // if doesn't duplicate,
          // set the barcode value in item
          // check it with search-item
          this.__item.openSearchItem();
        }
      }
    });
  }

  // function that called from parent
  get element() {
    return this.__barcodeWrapper;
  }

  focus() {
    this.__barcodeElement.focus();
  }

  lock() {
    // lock the item's barcode
    // so the barcode cannot be change
    this.__barcodeElement.disabled = true;
  }

  set barcode(barcode) {
    this.__barcodeElement.value = barcode;
  }
}

class TextElement {
  constructor(classname, value = "") {
    this.__classname = classname;

    this.__createTextElement(value);
  }

  __createTextElement(firstText) {
    this.__textElement = document.createElement("td");
    this.__textElement.className = `purchases-content no-input ${this.__classname}`;

    this.text = firstText;
  }

  set text(text) {
    this.__textElement.innerText = text;
  }

  get element() {
    return this.__textElement;
  }
}

class AmountElement {
  constructor(item, itemUi) {
    this.__item = item;
    this.__itemUI = itemUi;

    this.__createAmountElement();
    this.__listenAmount();
  }

  __createAmountElement() {
    this.__amountWrapper = document.createElement("td");
    this.__amountWrapper.className = "purchases-content amount-content";

    this.__amountElement = document.createElement("input");
    this.__amountElement.type = "number";
    this.__amountElement.value = 1;
    this.__amountElement.min = 1;

    this.__amountWrapper.appendChild(this.__amountElement);
  }

  __listenAmount() {
    this.__amountElement.addEventListener("change", (e) => {
      let amount = e.target.value;
      amount = parseInt(amount);

      this.__item.setSingleData("amount", amount);
    });
  }

  // function called from above

  get element() {
    // function called from itemUi
    return this.__amountWrapper;
  }

  set amount(amount) {
    // set amount input value
    // function called from itemUi
    this.__amountElement.value = `${amount}`;
  }
}
