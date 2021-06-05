import { Submenu } from "./Submenu.js";

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

// ! sedang mencari cara untuk mencari ulang this.__filteredItems sehingga tidak perlu mengecek API berkali-kali

function item_searcher(hint, params = ["name", "barcode"], filteredItems = EXAMPLE_ITEMS_FROM_API) {
  // filteredItem is an array of filteredItems from search-item that need be researched again to prevent over-searching the API
  const matchedItems = [];

  // set the hint to lowercase
  hint = hint.toLowerCase();

  filteredItems.forEach((item) => {
    let isMatch = false;

    // if anyone of the parameter is match then return the item
    params.forEach((param) => {
      isMatch = isMatch || item[param].toLowerCase().includes(hint);
    });

    if (isMatch) matchedItems.push(item);
  });

  return matchedItems;
}

export class SearchItem extends Submenu {
  constructor(submenu, submenuWraper, submenuProperties, params = {}) {
    super(submenu, submenuWraper, submenuProperties);

    // seleted item from searchItem
    this.__selectedItem = null;
    this.__filteredItems = [];

    // extraction from params
    this.__itemReference = params.itemReference ?? null;
    this.__hint = params.hint ?? "";

    this.__firstSearchItemOrStartSearchItem();
  }

  // create element for search-item
  _createSubmenu() {
    this._submenuElement = document.createElement("div");
    this._submenuElement.className = "search-item";

    // append header and result list element
    this._submenuElement.append(this.__searchItemHeader.element, this.__searchItemResult.element);

    this._submenuWrapper.appendChild(this._submenuElement);

    this.__searchItemHeader.focusToHint();
  }

  _setSubmenu() {}

  _setListener() {
    // listen when keyboard input
    this._submenuElement.addEventListener("keydown", (e) => {
      const key = e.key;

      // arrow up / down to change item selection
      if (key === "ArrowUp" || key === "ArrowDown") {
        this.__searchItemResult.focusToResultItem(key === "ArrowDown" ? "next" : "previous");
      }

      // enter to select item to list
      else if (key === "Enter") {
        this.__searchItemResult.selectFilteredItem();
      }

      // other to edit text in input
      else {
        this.__searchItemHeader.focusToHint();
      }
    });
  }

  __firstSearchItemOrStartSearchItem() {
    // search the DB from hint (first barcode)
    // if matches only to one item then choose item directly and close the search-item
    // the barcode item must be same to the hint

    const matchedItemsWithBarcode = item_searcher(this.__hint, ["barcode"], undefined);
    if (matchedItemsWithBarcode.length === 1) {
      // immediately set selected item and close the search-item if item (barcode) is already found
      this.selectedItem = matchedItemsWithBarcode[0];
    } else {
      // proceed to continue searching if matched item is more than one
      // or no item found in first search
      // set child UI and classes

      this.__searchItemHeader = new SearchItemHeader(this, this.__hint);
      this.__searchItemResult = new SearchItemResults(this);

      // set the html
      this._initializeSubmenu();

      // focus to hint
      this.__searchItemHeader.focusToHint();

      // search the item if hint is not empty string
      if (this.__hint !== "") {
        this.__searchItemMatchBoth();
      }
    }
  }

  __searchItemMatchBoth(preventOversearch = false) {
    const matchedItemsWithBoth = item_searcher(
      this.__hint,
      undefined,
      preventOversearch ? this.__filteredItems : undefined
    );

    // set the results
    this.__filteredItems = matchedItemsWithBoth;
    this.__searchItemResult.setResults(matchedItemsWithBoth);
  }

  __addToSelectedItemToTransaction() {
    if (this.__itemReference !== null) {
      // if itemReference params exists,
      // change that reference's item using item's method
      this.__itemReference.data = this.__selectedItem;
    } else {
      // if itemReference doesn't exist (e.g. search-item accessed from shortcut)
      // create new item data on transaction
      this._submenu.createNewItem(this.__selectedItem);
    }
  }

  set hint(hint) {
    // change hint
    // function called from SearchItemHeader

    // get the previous hint and compare with the new hint
    // if the new hint is the same previous hint plus one character
    // prevent oversearch the API and let to research with the last filteredItem
    const previousHint = this.__hint;
    this.__hint = hint;

    this.__searchItemMatchBoth(this.__hint.includes(previousHint));
  }

  set selectedItem(selectedItem) {
    // set the selected item and automatically add to transaction
    this.__selectedItem = selectedItem;
    this.__addToSelectedItemToTransaction();

    // when item is selected, close the search-item
    this._submenu.hideSubmenu();
  }
}

class SearchItemHeader {
  constructor(searchItem, hint) {
    this.__searchItem = searchItem;
    this.__hint = hint;

    this.__createSearchItemHeaderElement();
    this.__listenHint();
  }

  __createSearchItemHeaderElement() {
    this.__headerElement = document.createElement("div");
    this.__headerElement.className = "search-item-header";
    this.__headerElement.innerHTML = '<p class="keyword-text">Kata Kunci:</p>';

    this.__hintElement = document.createElement("input");
    this.__hintElement.className = "keywordInput";
    this.__hintElement.type = "text";
    this.__hintElement.value = this.__hint;

    this.__headerElement.appendChild(this.__hintElement);
  }

  __listenHint() {
    this.__hintElement.addEventListener("input", (e) => {
      this.__searchItem.hint = e.target.value;
    });
  }

  get element() {
    return this.__headerElement;
  }

  focusToHint() {
    this.__hintElement.focus();
  }
}

class SearchItemResults {
  constructor(searchItem) {
    this.__searchItem = searchItem;

    this.__createSearchItemResultsElement();
  }

  __createSearchItemResultsElement() {
    this.__resultsElement = document.createElement("div");
    this.__resultsElement.className = "search-item-results";

    this.__matchedItemList = [];
    this.__matchedItemElements = [];

    this.__focusedItemIndex = null;

    this.__setInitalElement();
  }

  // set results header for initial
  __setInitalElement() {
    this.__resultsElement.innerHTML = `
        <div class="search-item-result-header">
          <p class="item-barcode">Kode Barang</p>
          <p class="item-name">Nama Barang</p>
          <p class="item-type">Satuan</p>
          <p class="item-price">Harga</p>
        </div>`;
  }

  setResults(resultObjectList = []) {
    this.__matchedItemList = resultObjectList;
    this.__setResultsElements();
  }

  __setResultsElements() {
    this.__setInitalElement();
    this.__matchedItemElements = [];

    this.__matchedItemList.forEach((matchedItem) => {
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
        this.__focusedItemIndex = this.__matchedItemElements.indexOf(resultElement);
        this.selectFilteredItem();
      });

      this.__resultsElement.appendChild(resultElement);
      this.__matchedItemElements.push(resultElement);
    });

    // focus to first child of result element
    this.__focusedItemIndex = 0;
    this.__focusToResultItemWithIndex();
  }

  __focusToResultItemWithIndex() {
    const focusedElement = this.__matchedItemElements[this.__focusedItemIndex];

    if (focusedElement) focusedElement.focus();
  }

  //
  focusToResultItem(position = "next") {
    // position: next/previous
    const previousFocusedIndex = this.__focusedItemIndex;
    if (position === "next" && this.__focusedItemIndex < this.__matchedItemElements.length - 1) {
      this.__focusedItemIndex += 1;
    } else if (position === "previous" && this.__focusedItemIndex > 0) {
      this.__focusedItemIndex -= 1;
    }

    if (previousFocusedIndex !== this.__focusedItemIndex) {
      this.__focusToResultItemWithIndex();
    }
  }

  selectFilteredItem() {
    // index will be the index from click listener @__setResultsElement
    // or be
    this.__searchItem.selectedItem = {
      ...this.__matchedItemList[this.__focusedItemIndex],
    };
  }

  get element() {
    return this.__resultsElement;
  }
}
