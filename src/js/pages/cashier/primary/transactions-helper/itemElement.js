export class ActionElement {
  #actionWrapper;
  #actionButton;
  #isDeletable;

  constructor(item) {
    this.item = item;

    this.#isDeletable = this.item.data.valid;

    // local properties
    this.#createActionElement();
    this.#listenAction();
  }

  #createActionElement() {
    this.#actionWrapper = document.createElement("td");
    this.#actionWrapper.className = `purchases-content action-content no-input`;

    this.#actionButton = document.createElement("button");
    this.#actionButton.classname = "focusable";
    this.#actionButton.innerHTML = `<i class="fas fa-times "></i>`;
    this.#setButtonAblity();

    this.#actionWrapper.appendChild(this.#actionButton);
  }

  #setButtonAblity() {
    // item can be deleted if it's deletable (valid)
    // set button disablity
    this.#actionButton.disabled = !this.#isDeletable;

    // set button disablity class
    if (this.#isDeletable) {
      this.#actionButton.classList.remove("disabled");
    } else {
      this.#actionButton.classList.add("disabled");
    }
  }

  #listenAction() {
    this.#actionWrapper.addEventListener("click", () => {
      if (this.#isDeletable) {
        // delete the item if data is valid and button is clicked
        this.#deleteThisItem();
      }
    });
  }

  // to item function
  #deleteThisItem() {
    // delete item through transaction
    this.item.deleteThisItem();
  }

  get element() {
    return this.#actionWrapper;
  }

  set deletable(isDeletable) {
    this.#isDeletable = isDeletable;
    this.#setButtonAblity();
  }
}

// Barcode element
export class BarcodeElement {
  #barcodeWrapper;
  #barcodeElement;

  constructor(item) {
    this.item = item;

    const firstBarcode = item.data.barcode;

    // create the barcode ui
    this.#createBarcodeElement(firstBarcode);
  }

  focus() {
    this.#barcodeElement.focus();
  }

  lock() {
    // lock the item's barcode
    // so the barcode cannot be change
    this.#barcodeElement.disabled = true;
  }

  // local related methods
  #createBarcodeElement(barcode) {
    // the wrapper element
    this.#barcodeWrapper = document.createElement("td");
    this.#barcodeWrapper.className = "purchases-content barcode-content focusable";

    // the input element
    this.#barcodeElement = document.createElement("input");
    this.#barcodeElement.type = "text";
    this.#barcodeElement.value = barcode;

    // listen to the input
    this.#listenBarcode();

    // append input to the wrapper
    this.#barcodeWrapper.appendChild(this.#barcodeElement);
  }

  #listenBarcode() {
    // if barcode is changed,
    // first, look for duplicate item on the list,
    // if it's not duplicate, then check to DB with search-item

    // if search-item is succeed, search-item will change the item data
    // else if search-item is closed, change item data and set validity to false
    const checkChange = (e) => {
      const barcodeValue = e.target.value;

      if (barcodeValue.length > 0) {
        this.item.setSeveralItemData({ barcode: barcodeValue });
        const isDuplicate = this.item.checkDuplicateFromItem();

        if (isDuplicate) {
          // if duplicate, then clear the barcode and set amount to 1
          this.item.setSeveralItemData({ barcode: "", amount: 1 });
          this.focus();
        } else {
          // if doesn't duplicate,
          // set the barcode value in item
          // check it with search-item
          this.item.openSearchFromItem();
        }
      }
    };

    this.#barcodeElement.addEventListener("change", checkChange);

    let isEnteredBeforeTimeout = false;
    this.#barcodeElement.addEventListener("keydown", ({ key }) => {
      if (key === "Enter") {
        if (isEnteredBeforeTimeout) {
          isEnteredBeforeTimeout = false;
          this.item.openSearchFromItem();
        } else {
          isEnteredBeforeTimeout = true;

          setTimeout(() => {
            isEnteredBeforeTimeout = false;
          }, 200);
        }
      }
    });
  }

  // function that called from parent
  get element() {
    return this.#barcodeWrapper;
  }

  set barcode(barcode) {
    this.#barcodeElement.value = barcode;
  }
}

export class TextElement {
  #textElement;
  #classname;

  constructor(classname, value = "") {
    this.#classname = classname;

    this.#createTextElement(value);
  }

  #createTextElement(firstText) {
    this.#textElement = document.createElement("td");
    this.#textElement.className = `purchases-content no-input ${this.#classname}`;

    this.text = firstText;
  }

  set text(text) {
    this.#textElement.innerText = text;
  }

  get element() {
    return this.#textElement;
  }
}

export class AmountElement {
  #amountWrapper;
  #amountElement;

  constructor(item) {
    this.item = item;

    const firstAmount = item.data.amount;

    this.#createAmountElement(firstAmount);
    this.#listenAmount();
  }

  #createAmountElement(firstAmount = 1) {
    this.#amountWrapper = document.createElement("td");
    this.#amountWrapper.className = "purchases-content amount-content focusable";

    this.#amountElement = document.createElement("input");
    this.#amountElement.type = "number";
    this.#amountElement.value = firstAmount;
    this.#amountElement.min = 1;

    this.#amountWrapper.appendChild(this.#amountElement);
  }

  #listenAmount() {
    this.#amountElement.addEventListener("change", (e) => {
      let amount = e.target.value;
      amount = parseInt(amount);

      this.item.setSeveralItemData({ amount });
    });
  }

  get element() {
    // function called from itemUi
    return this.#amountWrapper;
  }

  set value(amount = 1) {
    // set amount input value
    // function called from itemUi
    this.#amountElement.value = amount;
  }
}
