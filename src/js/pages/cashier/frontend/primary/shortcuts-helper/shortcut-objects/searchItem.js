import { CashierEndpoint } from "../../../../../../api/endpoint.js";
import { Submenu } from "./SubmenuPrototype.js";

// todo: output pada search item adalah Promise

// function item_searcher(hint, params = ["name", "barcode"], filteredItems, full_match = false) {
async function item_searcher({
  type = "cashier",
  initialFilteredItems = null,
  detail: { hint = "", params = ["name", "barcode"], full_match = false },
}) {
  // search first from DB if initialFilteredItem is none
  if (initialFilteredItems === null) {
    if (type === "cashier") {
      // initialFilteredItems = await searchItemDB(hint, params, full_match);
    } else {
      // initialFilteredItems = await searchItemDB(hint, params, full_match);
    }
  }

  // filteredItem is an array of filteredItems from search-item that need be researched again to prevent over-searching the API
  const matchedItems = [];

  // set the hint to lowercase
  hint = hint.toLowerCase();

  // return none if hint is none
  if (hint === "") return [];

  initialFilteredItems.forEach((item) => {
    let previousMatch = false;

    // if anyone of the parameter is match then return the item
    params.forEach((param) => {
      let currentMatch;
      if (full_match) {
        currentMatch = item[param].toLowerCase() === hint;
      } else {
        currentMatch = item[param].toLowerCase().includes(hint);
      }

      previousMatch = previousMatch || currentMatch;
    });

    if (previousMatch) matchedItems.push(item);
  });

  return matchedItems;
}

export class SearchItem extends Submenu {
  #filteredItems = [];
  #selectedItem = null;

  #itemReference;
  #hint;
  #type;

  #searchItemHeader;
  #searchItemResult;

  constructor(submenuWrapper, submenuProperties, params = {}) {
    super(submenuWrapper, submenuProperties);

    // extraction from params
    this.#itemReference = params.itemReference ?? null;
    this.#hint = params.hint ?? "";
    this.#type = params.type ?? "cashier";

    this.#init();
  }

  // create element for search-item
  _createSubmenu() {
    this._submenuElement = document.createElement("div");
    this._submenuElement.className = "search-item";

    // append header and result list element
    this._submenuElement.append(this.#searchItemHeader.element, this.#searchItemResult.element);

    this._submenuWrapper.appendChild(this._submenuElement);

    this.#searchItemHeader.focusToHint();
  }

  _setSubmenu() {}

  _setListener() {
    // listen when keyboard input
    this._submenuElement.addEventListener("keydown", (e) => {
      const key = e.key;

      // arrow up / down to change item selection
      if (key === "ArrowUp" || key === "ArrowDown") {
        this.#searchItemResult.focusToResultItem(key === "ArrowDown" ? "next" : "previous");
      }

      // enter to select item to list
      else if (key === "Enter") {
        this.#searchItemResult.selectFilteredItem();
      }

      // other to edit text in input
      else {
        this.#searchItemHeader.focusToHint();
      }
    });
  }

  async #init() {
    // set child UI and classes

    this.#searchItemHeader = new SearchItemHeader(this, this.#hint);
    this.#searchItemResult = new SearchItemResults(this, this.#type);

    // set the html
    this._initializeSubmenu();

    // focus to hint
    this.#searchItemHeader.focusToHint();

    // search the item if hint is not empty string
    if (this.#hint !== "") {
      await this.#searchItemMatchBoth();
    }
  }

  async #searchItemMatchBoth(alreadyFilteredItems = null) {
    const matchedItemsWithBoth = await item_searcher({
      type: this.#type,
      detail: {
        hint: this.#hint,
        full_match: false,
      },
    });

    // set the results
    this.#filteredItems = matchedItemsWithBoth;
    this.#searchItemResult.setResults(matchedItemsWithBoth);
  }

  #addToSelectedItemToItemList() {
    if (this.#itemReference !== null) {
      // if itemReference params exists,
      // change that reference's item using item's method
      this.#itemReference.data = {
        data: this.#selectedItem,
        code: 20,
      };
    } else {
      // if itemReference doesn't exist (e.g. search-item accessed from shortcut)
      // create new item data on itemList
      this._submenu.window.childs.transactionList.currentTransaction.itemList.createNewItem(
        this.#selectedItem,
        {
          isFromShortcut: true,
        }
      );
    }
  }

  #addToStockItemList() {
    if (this.#itemReference !== null) {
      if (this.#selectedItem !== null) {
        this.#itemReference.knownItem(this.#selectedItem);
      } else {
        this.#itemReference.unknownItem();
      }
    }
  }

  set hint(hint) {
    // change hint
    // function called from SearchItemHeader

    // get the previous hint and compare with the new hint
    // if the new hint is the same previous hint plus one character
    // prevent oversearch the API and let to research with the last filteredItem
    const previousHint = this.#hint;
    this.#hint = hint;

    if (previousHint !== "") {
      this.#searchItemMatchBoth(this.#hint.includes(previousHint));
    } else {
      this.#searchItemMatchBoth();
    }
  }

  set selectedItem(selectedItem) {
    // set the selected item and automatically add to current ItemList
    this.#selectedItem = selectedItem;

    if (this._submenu.window.name === "cashier") {
      this.#addToSelectedItemToItemList();
    } else {
      if (this._submenu.window.name === "stock") {
        this.#addToStockItemList();
      }
    }

    // when item is selected, close the search-item
    this._submenu.hideSubmenu();
  }

  static async exactMatch(hint, type) {
    // return itemData if hint matches exactly with a barcode on DB
    // return false if not match exact

    const matchExactBarcode = await item_searcher({
      type: type,
      initialFilteredItems: undefined,
      detail: { hint: hint, params: ["barcode"], full_match: true },
    });
    isMatchExact = matchExactBarcode.length === 1;

    if (isMatchExact) {
      const matchExact = matchExactBarcode[0];
      return matchExact;
    }

    return false;
  }

  static async anyMatch(hint, type) {
    // return true if hint matches any barcode or name on DB (doesnt match exact with any barcode)
    // return false if hint doesn't match any barcode or name

    const matchAny = await item_searcher({
        type: type,
        initialFilteredItems: undefined,
        detail: { hint: hint, full_match: true },
      }),
      isMatchAny = matchAny.length > 0;

    return isMatchAny;
  }
}

class SearchItemHeader {
  #searchItem;
  #hint;
  #headerElement;
  #hintElement;
  constructor(searchItem, hint) {
    this.#searchItem = searchItem;
    this.#hint = hint;

    this.#createSearchItemHeaderElement();
    this.#listenHint();
  }

  #createSearchItemHeaderElement() {
    this.#headerElement = document.createElement("div");
    this.#headerElement.className = "search-item-header";
    this.#headerElement.innerHTML = '<p class="keyword-text">Kata Kunci:</p>';

    this.#hintElement = document.createElement("input");
    this.#hintElement.className = "keywordInput";
    this.#hintElement.type = "text";
    this.#hintElement.value = this.#hint;

    this.#headerElement.appendChild(this.#hintElement);
  }

  #listenHint() {
    this.#hintElement.addEventListener("input", (e) => {
      this.#searchItem.hint = e.target.value;
    });
  }

  get element() {
    return this.#headerElement;
  }

  focusToHint() {
    this.#hintElement.focus();
  }
}

const SEARCH_ITEM_RESULTS = {
  cashier: {
    html: `
        <div class="search-item-result-header">
          <p class="item-barcode">Kode Barang</p>
          <p class="item-name">Nama Barang</p>
          <p class="item-type">Satuan</p>
          <p class="item-price">Harga</p>
        </div>`,
    setFunction: function (item) {
      const { barcode, name, quantity, price } = item;

      const resultElement = document.createElement("div");
      resultElement.tabIndex = "-1";
      resultElement.className = "search-item-result-content";

      resultElement.innerHTML = `
      <p class="item-barcode">${barcode}</p>
      <p class="item-name">${name}</p>
      <p class="item-type">${quantity}</p>
      <p class="item-price">${price}</p>
    `;

      return resultElement;
    },
  },
  stock: {
    html: `
        <div class="search-item-result-header">
          <p class="item-barcode">Kode Barang</p>
          <p class="item-name">Nama Barang</p>
          <p class="item-type">Satuan</p>
          <p class="item-price">Harga Masuk</p>
          <p class="item-price">Harga Jual</p>
          <p class="item-type">Stock</p>
        </div>`,
    setFunction: function (item) {
      const { barcode, name, quantity, buyPrice, sellPrice, stock } = item;

      const resultElement = document.createElement("div");
      resultElement.tabIndex = "-1";
      resultElement.className = "search-item-result-content";

      resultElement.innerHTML = `
      <p class="item-barcode">${barcode}</p>
      <p class="item-name">${name}</p>
      <p class="item-type">${quantity}</p>
      <p class="item-price">${buyPrice}</p>
      <p class="item-price">${sellPrice}</p>
      <p class="item-type">${stock}</p>
    `;

      return resultElement;
    },
  },
};

class SearchItemResults {
  #searchItem;
  #resultsElement;
  #matchedItemList;
  #matchedItemElements;
  #focusedItemIndex;
  #result;

  constructor(searchItem, type) {
    this.#searchItem = searchItem;
    this.#result = SEARCH_ITEM_RESULTS[type];

    this.#createSearchItemResultsElement();
  }

  setResults(resultObjectList = []) {
    this.#matchedItemList = resultObjectList;
    this.#setResultsElements();
  }

  //
  focusToResultItem(position = "next") {
    // position: next/previous
    const previousFocusedIndex = this.#focusedItemIndex;
    if (position === "next" && this.#focusedItemIndex < this.#matchedItemElements.length - 1) {
      this.#focusedItemIndex += 1;
    } else if (position === "previous" && this.#focusedItemIndex > 0) {
      this.#focusedItemIndex -= 1;
    }

    if (previousFocusedIndex !== this.#focusedItemIndex) {
      this.#focusToResultItemWithIndex();
    }
  }

  selectFilteredItem() {
    // index will be the index from click listener @#setResultsElement
    // or be
    this.#searchItem.selectedItem = {
      ...this.#matchedItemList[this.#focusedItemIndex],
    };
  }

  #createSearchItemResultsElement() {
    this.#resultsElement = document.createElement("div");
    this.#resultsElement.className = "search-item-results";

    this.#matchedItemList = [];
    this.#matchedItemElements = [];

    this.#focusedItemIndex = null;

    this.#setInitalElement();
  }

  // set results header for initial
  #setInitalElement() {
    this.#resultsElement.innerHTML = this.#result["html"];
  }

  #setResultsElements() {
    this.#setInitalElement();
    this.#matchedItemElements = [];

    this.#matchedItemList.forEach((matchedItem) => {
      const resultElement = this.#result.setFunction(matchedItem);

      // set listener to result item
      // when onclick, it'll be selected item from the list
      resultElement.addEventListener("click", () => {
        this.#focusedItemIndex = this.#matchedItemElements.indexOf(resultElement);
        this.selectFilteredItem();
      });

      this.#resultsElement.appendChild(resultElement);
      this.#matchedItemElements.push(resultElement);
    });

    // focus to first child of result element
    this.#focusedItemIndex = 0;
    this.#focusToResultItemWithIndex();
  }

  #focusToResultItemWithIndex() {
    const focusedElement = this.#matchedItemElements[this.#focusedItemIndex];

    if (focusedElement) focusedElement.focus();
  }

  get element() {
    return this.#resultsElement;
  }
}
