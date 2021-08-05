import { set_proper_price } from "../../etc/others.mjs";

class ActionElement {
  #ability;

  constructor(item) {
    this.item = item;

    this.#createUI();
  }

  #createUI() {
    this.actionElement = document.createElement("div");
    this.actionElement.className = "actions content";

    // creating button
    this.actionButton = document.createElement("button");
    this.actionButton.innerHTML = `<i class="fas fa-times"></i>`;
    this.actionElement.appendChild(this.actionButton);

    // setting button ability
    this.ability = false;

    this.item.itemElement.appendChild(this.actionElement);
    this.#setListeners();
  }

  #setListeners() {
    this.actionButton.addEventListener("click", () => {
      // delete item if able to delete
      if (this.#ability) {
        this.item.delete();
      }
    });
  }

  able() {
    this.ability = true;
  }

  disable() {
    this.ability = false;
  }

  toggle() {
    this.ability = !this.#ability;
  }

  set ability(ability) {
    this.#ability = ability;

    // refresh the button ability
    this.actionButton.disabled = !ability;
  }

  get ability() {
    return this.#ability;
  }
}

class ValueElement {
  // used in names, buyPrice, sellPrice, stock input
  constructor(item, className, inputName) {
    this._item = item;
    this._className = className;
    this._inputName = inputName;

    // states
    this._isDisabled = false;

    // create input
    this._inputElement = document.createElement("input");
    this._inputElement.name = this._inputName;
  }

  _createUI() {
    this._setInput();

    this._valueElement = document.createElement("div");
    this._valueElement.className = this._className;

    // check for initial disablation
    if (this._isDisabled) {
      this.lock();
    }

    this._valueElement.append(this._inputElement);
    this._item.itemElement.appendChild(this._valueElement);

    // listen
    this._setListeners();
  }

  // inherited
  _setInput() {}
  _setListeners() {}

  // public
  lock() {
    this._inputElement.disabled = true;
    this._inputElement.classList.add("locked");
  }

  unlock() {
    this._inputElement.disabled = null;
    this._inputElement.classList.remove("locked");
  }

  focus() {
    setTimeout(() => {
      this._inputElement.focus();
    }, 10);
  }

  set value(value) {
    this._inputElement.value = value;
  }

  get value() {
    return this._inputElement.value;
  }
}

class BarcodeElement extends ValueElement {
  // states
  #isBlurred = false;

  constructor(item, className, inputName) {
    super(item, className, inputName);
    this._createUI();
  }

  _setInput() {
    this._inputElement.type = "text";
  }

  _setListeners() {
    let isClickedBeforeTimeout = false,
      isEnteredBeforeTimeout = false,
      doubleClickTimeoutFn,
      doubleEnterTimeoutFn;

    this._inputElement.addEventListener("keydown", ({ key }) => {
      // detects double enter and opens the searchitem

      if (key === "Enter") {
        if (isEnteredBeforeTimeout) {
          // remove timeout
          clearTimeout(doubleEnterTimeoutFn);

          isEnteredBeforeTimeout = false;
          // todo: open search item
        } else {
          isEnteredBeforeTimeout = true;
          doubleEnterTimeoutFn = setTimeout(() => {
            isEnteredBeforeTimeout = false;
          }, 200);
        }
      }
    });

    this._inputElement.addEventListener("blur", ({ target: { value } }) => {
      this.#isBlurred = true;
      this._item.checkBarcodeChange(value);
    });

    this._inputElement.addEventListener("change", ({ target: { value } }) => {
      // check if the element is blurred first
      setTimeout(() => {
        if (this.#isBlurred) {
          this.#isBlurred = false;
        } else {
          this._item.checkBarcodeChange(value);
        }

        this.#isBlurred = false;
      }, 100);
    });

    this._valueElement.addEventListener("click", () => {
      // cannot changed if no content
      if (this.value) {
        // if disabled, double click to change content
        if (isClickedBeforeTimeout) {
          clearTimeout(doubleClickTimeoutFn);

          this.unlock();
          this._inputElement.focus();

          // lock again if not focused
          this._inputElement.addEventListener("blur", () => {
            this.lock();
          });
        } else {
          isClickedBeforeTimeout = true;
          doubleClickTimeoutFn = setTimeout(() => {
            isClickedBeforeTimeout = false;
          }, 200);
        }
      }
    });
  }

  set value(value) {
    if (value !== "") {
      // lock the barcode after value added
      this.lock();
    }

    super.value = value;
  }

  get value() {
    return super.value;
  }
}

class NameElement extends ValueElement {
  constructor(item, className, inputName) {
    super(item, className, inputName);

    this._isDisabled = true;

    this._createUI();
  }

  _setInput() {
    this._inputElement.type = "text";
  }

  _setListeners() {
    let isBeforeTimeout = false,
      timeoutFn;

    this._valueElement.addEventListener("click", () => {
      // cannot changed if no content
      if (this.value) {
        // if disabled, double click to change content
        if (isBeforeTimeout) {
          clearTimeout(timeoutFn);

          this.unlock();
          this._inputElement.focus();

          // lock again if not focused
          this._inputElement.addEventListener("blur", () => {
            this.lock();
          });
        } else {
          isBeforeTimeout = true;
          timeoutFn = setTimeout(() => {
            isBeforeTimeout = false;
          }, 200);
        }
      }
    });
  }

  set value(value) {
    super.value = value;
  }

  get value() {
    return super.value;
  }
}

class PriceElement extends ValueElement {
  constructor(item, className, inputName) {
    super(item, className, inputName);

    this._isDisabled = true;

    this._createUI();
  }

  _setInput() {
    this._inputElement.type = "text";
    this._inputElement.classList.add("remove-arrow");
  }

  _setListeners() {
    this._inputElement.addEventListener("input", ({ target: { value } }) => {
      // only get the numbers
      value = value.replace(/\D/g, "");

      this.value = value;
    });
  }

  set value(value) {
    // open to can be edited
    this.unlock();

    // set to proper price
    const price = `Rp. ${set_proper_price(value)}`;

    super.value = price;
  }

  get value() {
    return super.value;
  }
}

class NumberElement extends ValueElement {
  constructor(item, className, inputName) {
    super(item, className, inputName);

    this._isDisabled = true;

    this._createUI();
  }

  _setInput() {
    this._inputElement.type = "number";
    this._inputElement.min = 0;
  }

  _setListeners() {
    this._inputElement.addEventListener("keydown", ({ key }) => {
      // goto next item if entered
      if (key === "Enter") {
        this._item.itemList.focusToNextItem(this._inputElement);
      }
    });
  }

  set value(value) {
    super.value = value;
  }

  get value() {
    return super.value;
  }
}

export { ActionElement, BarcodeElement, NameElement, PriceElement, NumberElement };
