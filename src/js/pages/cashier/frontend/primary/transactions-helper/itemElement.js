/**
 * @typedef {import('../transactions-helper/item').Item} Item
 */

export class ActionElement {
  /**
   * wrapping action's element
   * @type {HTMLElement}
   * @private
   */
  #actionWrapper;

  /**
   * contains action button
   * @type {HTMLElement}
   * @private
   */
  #actionButton;

  /**
   * is action button clickable
   * @type {Boolean}
   * @private
   */
  #isDeletable;

  /**
   * create action element for cancelling an item
   * @param {Item} item
   */
  constructor(item) {
    this.item = item;

    this.#isDeletable = this.item.data.valid;

    // local properties
    this.#createActionElement();
    this.#listenAction();
  }

  /**
   * creates action element with its childs
   * @private
   */
  #createActionElement() {
    // create action wrapper element
    this.#actionWrapper = document.createElement("td");
    this.#actionWrapper.className = `purchases-content action-content no-input`;

    // create action button element
    this.#actionButton = document.createElement("button");
    this.#actionButton.className = "focusable";
    this.#actionButton.innerHTML = `<i class="fas fa-times "></i>`;
    this.#setButtonAblity();

    // append button to wrapper
    this.#actionWrapper.appendChild(this.#actionButton);
  }

  /**
   * @private
   */
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

  /**
   * @private
   */
  #listenAction() {
    this.#actionWrapper.addEventListener("click", () => {
      // delete the item if data is valid and button is clicked
      if (this.#isDeletable) {
        this.#deleteThisItem();
      }
    });
  }

  /**
   * @private
   */
  #deleteThisItem() {
    this.item.deleteThisItem();
  }

  /**
   * @type {HTMLElement}
   */
  get element() {
    return this.#actionWrapper;
  }

  /**
   * set to make this item deletable
   */
  ableToDelete() {
    this.#isDeletable = true;
    this.#setButtonAblity();
  }
}

export class BarcodeElement {
  /**
   * contains barcode wrapper element
   * @type {HTMLElement}
   * @private
   */
  #barcodeWrapper;

  /**
   * contains barcode input element
   * @type {HTMLElement}
   * @private
   */
  #barcodeElement;

  /**
   * contains current barcode value
   * @type {String}
   * @private
   */
  #currentBarcodeValue;

  /**
   * creates barcode element
   * @constructor
   * @param {Item} item
   * @param {String} initialBarcode
   */
  constructor(item, initialBarcode) {
    this.item = item;

    // set barcode's value with initial barcode from item
    // e.g. an item added from SearchItem shortcut, so barcode's input value is not null
    this.#currentBarcodeValue = initialBarcode;

    this.#createBarcodeElement();

    // lock if item is already valid e.g. from searchItem
    if (this.item.data.valid) this.lock();
  }

  /**
   * focus to barcode
   */
  focus() {
    this.#barcodeElement.focus();
  }

  /**
   * lock the item's barcode
   * so the barcode cannot be change
   */
  lock() {
    this.#barcodeElement.disabled = true;
  }

  /**
   * create barcode wrapper and input elements
   * @private
   */
  #createBarcodeElement() {
    // the wrapper element
    this.#barcodeWrapper = document.createElement("td");
    this.#barcodeWrapper.className = "purchases-content barcode-content focusable";

    // the input element
    this.#barcodeElement = document.createElement("input");
    this.#barcodeElement.type = "text";
    this.#barcodeElement.value = this.#currentBarcodeValue;

    // listen to the input
    this.#listenBarcode();

    // append input to the wrapper
    this.#barcodeWrapper.appendChild(this.#barcodeElement);
  }

  /**
   * set listener to barcode.
   */
  #listenBarcode() {
    /**
     * if barcode is changed,
     * first, look for duplicate item on the list,
     * if it's not duplicate, then check to DB with search-item
     *
     * if search-item is succeed, search-item will change the item data
     * else if search-item is closed, change item data and set validity to false
     *
     * @param {Event} e
     */
    const checkChange = (e) => {
      // todo: change function name
      const barcodeValue = e.target.value;

      // update #barcodeValue
      this.#currentBarcodeValue = barcodeValue;

      if (barcodeValue.length > 0) {
        this.item.setSeveralItemData({ hint: barcodeValue });
        const isDuplicate = this.item.checkDuplicateFromItem();

        if (isDuplicate) {
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

    // double enter to open searchItem
    let isEnteredBeforeTimeout = false;

    const checkDoubleEnter = (key) => {
      if (key === "Enter") {
        // if enter pressed before timeout, open searchitem
        if (isEnteredBeforeTimeout) {
          isEnteredBeforeTimeout = false;
          this.item.openSearchFromItem();
        }

        // else, set isEnteredBeforeTimeout to true and wait again
        else {
          isEnteredBeforeTimeout = true;

          setTimeout(() => {
            isEnteredBeforeTimeout = false;
          }, 200);
        }
      }
    };

    // arrow up / down to change its amount
    const changeAmountByArrow = (key) => {
      const lastCaret = this.#barcodeElement.selectionStart;
      const setToLastCaret = () => {
        setTimeout(() => {
          this.#barcodeElement.setSelectionRange(lastCaret, lastCaret);
        }, 10);
      };

      if (key === "ArrowUp") {
        this.item.increaseAmount();
      } else if (key === "ArrowDown") {
        this.item.decreaseAmount();
      }

      if (key === "ArrowUp" || key === "ArrowDown") {
        setToLastCaret();
      }
    };

    this.#barcodeElement.addEventListener("keydown", ({ key }) => {
      checkDoubleEnter(key);
      changeAmountByArrow(key);
    });
  }

  /**
   * @type {HTMLElement}
   */
  get element() {
    return this.#barcodeWrapper;
  }

  /**
   * @type {String}
   */
  get barcodeValue() {
    return this.#currentBarcodeValue;
  }

  /**
   * @param {String} barcode - new barcode
   */
  set barcode(barcode) {
    const barcodeBefore = this.#currentBarcodeValue;

    if (barcode !== barcodeBefore) {
      this.#currentBarcodeValue = barcode;
      this.#barcodeElement.value = barcode;
    }
  }
}

export class TextElement {
  /**
   * contains text ui element with its childs
   * @type {HTMLElement}
   * @private
   */
  #textElement;

  /**
   * contains classname of textElement
   * @type {String}
   * @private
   */
  #classname;

  /**
   * contains current text
   * @type {String}
   * @private
   */
  #currentTextValue;

  /**
   * creates textelement
   * @param {String} classname - classname of this textElement
   * @param {String} value - inital value of textElement
   */
  constructor(classname, value = "") {
    this.#classname = classname;
    this.#currentTextValue = value;

    this.#createTextElement();
  }

  #createTextElement() {
    this.#textElement = document.createElement("td");
    this.#textElement.className = `purchases-content no-input ${this.#classname}`;

    this.text = this.#currentTextValue;
  }

  /**
   * @param {String} text - new text value
   */
  set text(text) {
    this.#currentTextValue = text;
    this.#textElement.innerText = text;
  }

  /**
   * @type {HTMLElement}
   */
  get element() {
    return this.#textElement;
  }
}

export class AmountElement {
  /**
   * contains amount wrapper element
   * @type {HTMLElement}
   * @private
   */
  #amountWrapper;

  /**
   * contains amount input element
   * @type {HTMLElement}
   * @private
   */
  #amountElement;

  /**
   * max amount value when an item is in completed transaction
   * @type {Number}
   * @private
   */
  #maxAmountValue = 0;

  /**
   * contains value of is transacton completed
   * @type {Boolean}
   * @private
   */
  #isTransactionCompleted;

  /**
   * contains current amount input value
   * @type {Number}
   * @private
   */
  #currentAmountValue;

  /**
   * creates amount element
   * @param {Item} item
   * @param {Number} [initialAmount = 1]
   */
  constructor(item, initialAmount) {
    this.item = item;

    // set the value
    this.#currentAmountValue = initialAmount;

    // initialize
    this.#createAmountElement();
    this.#checkTransactionStatus();

    // listener
    this.#listenAmount();
  }

  /**
   * creates amount wrapper element and amount input element
   * @private
   */
  #createAmountElement(firstAmount = 1) {
    this.#amountWrapper = document.createElement("td");
    this.#amountWrapper.className = "purchases-content amount-content focusable";

    // creates input
    this.#amountElement = document.createElement("input");
    this.#amountElement.type = "number";
    this.#amountElement.value = this.#currentAmountValue;
    this.#amountElement.min = 1;

    // appends input into wrapper
    this.#amountWrapper.appendChild(this.#amountElement);
  }

  /**
   * listen to amount input
   * @private
   */
  #listenAmount() {
    // detect amount value change
    this.#amountElement.addEventListener("change", (e) => {
      let amount = e.target.value;

      // set amount to 1 if NaN
      if (amount == "") {
        this.#amountElement.value = 1;
        amount = 1;
      }

      amount = parseInt(amount);

      // set amount below max if completed
      if (this.#isTransactionCompleted && amount > this.#maxAmountValue) {
        this.#amountElement.value = this.#maxAmountValue;
        amount = this.#maxAmountValue;
      }

      // set item's amount
      this.item.setSeveralItemData({ amount });
    });
  }

  /**
   * check transaction's statui to determine max amount set or not
   * @private
   */
  #checkTransactionStatus() {
    this.#isTransactionCompleted = this.item.transactionStatus.isCompleted;
    if (this.#isTransactionCompleted) {
      this.setMaxAmount();
    }
  }

  /**
   * @type {HTMLElement}
   */
  get element() {
    // function called from itemUi
    return this.#amountWrapper;
  }

  /**
   * @param {Number} [amount=1] - new amount value
   */
  set value(amount = 1) {
    // set amount input value
    // function called from itemUi
    this.#amountElement.value = amount;
  }

  /**
   * set max amount
   */
  setMaxAmount() {
    this.#isTransactionCompleted = true;
    // set max amount if transaction is completed
    this.#maxAmountValue = this.item.data.maxAmount;
    this.#amountElement.max = this.#maxAmountValue;
  }
}
