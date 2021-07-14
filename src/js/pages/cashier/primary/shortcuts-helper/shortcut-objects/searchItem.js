import { Submenu } from "./SubmenuPrototype.js";

const EXAMPLE_ITEMS_FROM_API = [
  {
    barcode: "121",
    name: "A",
    quantity: "Kotak",
    price: 200000,
  },
  {
    barcode: "132",
    name: "B",
    quantity: "Box",
    price: 10000,
  },
  {
    barcode: "221",
    name: "C",
    quantity: "Sachet",
    price: 2000,
  },
  {
    barcode: "222",
    name: "C",
    quantity: "Bungkus",
    price: 21000,
  },
  {
    barcode: "231",
    name: "D",
    quantity: "Pcs",
    price: 10500,
  },
];

function item_searcher(hint, params = ["name", "barcode"], filteredItems = EXAMPLE_ITEMS_FROM_API, full_match = false) {
  // filteredItem is an array of filteredItems from search-item that need be researched again to prevent over-searching the API
  const matchedItems = [];

  // set the hint to lowercase
  hint = hint.toLowerCase();

  filteredItems.forEach((item) => {
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
  #selectedItem = null;
  #filteredItems = [];
  #itemReference;
  #hint;
  #searchItemHeader;
  #searchItemResult;

  constructor(submenuWrapper, submenuProperties, params = {}) {
    super(submenuWrapper, submenuProperties);

    // extraction from params
    this.#itemReference = params.itemReference ?? null;
    this.#hint = params.hint ?? "";

    this.#firstSearchItemOrStartSearchItem();
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

  #firstSearchItemOrStartSearchItem() {
    // search the DB from hint (first barcode)
    // if matches only to one item then choose item directly and close the search-item
    // the barcode item must be same to the hint

    const matchedItemsWithBarcode = item_searcher(this.#hint, ["barcode"], undefined, true);
    if (matchedItemsWithBarcode.length === 1) {
      // immediately set selected item and close the search-item if item (barcode) is already found
      setTimeout(() => {
        // set timeout so SearchItem established completely first
        // because the process below contains Submenu.hideSubmenu()

        // if Submenu.hideSubmenu() is called before SearchItem established,
        // then the Submenu.#openedSubmenu won't be null, it'll be a SearchItem instance
        // which will block other submenu creation when it called
        this.selectedItem = matchedItemsWithBarcode[0];
      }, 10);
    } else {
      // proceed to continue searching if matched item is more than one
      // or no item found in first search
      // set child UI and classes

      this.#searchItemHeader = new SearchItemHeader(this, this.#hint);
      this.#searchItemResult = new SearchItemResults(this);

      // set the html
      this._initializeSubmenu();

      // focus to hint
      this.#searchItemHeader.focusToHint();

      // search the item if hint is not empty string
      if (this.#hint !== "") {
        this.#searchItemMatchBoth();
      }
    }
  }

  #searchItemMatchBoth(alreadyFilteredItems = null) {
    const matchedItemsWithBoth = item_searcher(
      this.#hint,
      undefined,
      alreadyFilteredItems ? this.#filteredItems : undefined
    );

    // set the results
    this.#filteredItems = matchedItemsWithBoth;
    this.#searchItemResult.setResults(matchedItemsWithBoth);
  }

  #addToSelectedItemToItemList() {
    if (this.#itemReference !== null) {
      // if itemReference params exists,
      // change that reference's item using item's method
      this.#itemReference.data = { data: this.#selectedItem, code: 20 };
    } else {
      // if itemReference doesn't exist (e.g. search-item accessed from shortcut)
      // create new item data on itemList
      this._submenu.cashier.childs.transactionList.currentTransaction.itemList.createNewItem(this.#selectedItem);
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
    this.#addToSelectedItemToItemList();

    // when item is selected, close the search-item
    this._submenu.hideSubmenu();

    // focus to latest barcode in list if itemReference is exist
    if (this.#itemReference) {
      this.#itemReference.itemList.focusToLatestBarcode();
    }
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

class SearchItemResults {
  #searchItem;
  #resultsElement;
  #matchedItemList;
  #matchedItemElements;
  #focusedItemIndex;
  constructor(searchItem) {
    this.#searchItem = searchItem;

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
    this.#resultsElement.innerHTML = `
        <div class="search-item-result-header">
          <p class="item-barcode">Kode Barang</p>
          <p class="item-name">Nama Barang</p>
          <p class="item-type">Satuan</p>
          <p class="item-price">Harga</p>
        </div>`;
  }

  #setResultsElements() {
    this.#setInitalElement();
    this.#matchedItemElements = [];

    this.#matchedItemList.forEach((matchedItem) => {
      const { barcode, name, quantity, price } = matchedItem;

      const resultElement = document.createElement("div");
      resultElement.tabIndex = "-1";
      resultElement.className = "search-item-result-content";

      resultElement.innerHTML = `
      <p class="item-barcode">${barcode}</p>
      <p class="item-name">${name}</p>
      <p class="item-type">${quantity}</p>
      <p class="item-price">${price}</p>
    `;

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
