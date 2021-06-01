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

export class SearchItem {
  constructor(submenu, submenuElement, params) {
    this.__submenu = submenu;
    this.__submenuElement = submenuElement;

    // seleted item from searchItem
    this.__selectedItem = null;

    // extraction from params

    this.__itemReference = params.itemReference ?? null;
    this.__hint = params.hint ?? "";

    const immediatelyMatchedItems = this.__firstSearchFound();

    if (immediatelyMatchedItems.length === 1) {
      // immediately set selected item and close the search-item if item (barcode) is already found
      this.selectedItem = immediatelyMatchedItems[0];
    } else {
      // proceed to continue searching if matched item is more than one
      // or no item found in first search
      // set child UI and classes

      this.__searchItemHeader = new SearchItemHeader(this, this.__hint);
      this.__searchItemResult = new SearchItemResults(this);

      this.__createSearchItemElement();

      if (this.__hint != "") {
        this.__searchItemFromDB();
      }
    }
  }

  // create element for search-item
  __createSearchItemElement() {
    this.__searchItemElement = document.createElement("div");
    this.__searchItemElement.className = "search-item";

    // append header and result list element
    this.__searchItemElement.append(this.__searchItemHeader.element, this.__searchItemResult.element);

    this.__submenuElement.appendChild(this.__searchItemElement);
    this.__submenu.showSubmenu();

    this.__searchItemHeader.focusToHint();
  }

  // searching item on DB with hint (simulation)
  __searchItemFromDB() {
    const matchedItems = [];

    // set the hint to lowercase
    this.__hint = this.__hint.toLowerCase();

    EXAMPLE_ITEMS_FROM_API.forEach((item) => {
      const isBarcodeMatch = item.barcode.toLowerCase().includes(this.__hint),
        isNameMatch = item.name.toLowerCase().includes(this.__hint);

      if (isBarcodeMatch || isNameMatch) {
        matchedItems.push(item);
      }
    });

    this.__searchItemResult.setResults(matchedItems);
  }

  __addToSelectedItemToTransaction() {
    if (this.__itemReference !== null) {
      // if itemReference params exists,
      // change that reference's item using item's method
      this.__itemReference.data = this.__selectedItem;
    } else {
      // if itemReference doesn't exist (e.g. search-item accessed from shortcut)
      // create new item data on transaction
      this.__submenu.createNewItem(this.__selectedItem);
    }
  }

  set hint(hint) {
    // change hint
    // function called from SearchItemHeader
    this.__hint = hint;
    this.__searchItemFromDB();
  }

  set selectedItem(selectedItem) {
    // set the selected item and automatically add to transaction
    this.__selectedItem = selectedItem;
    this.__addToSelectedItemToTransaction();

    // when item is selected, close the search-item
    this.removeSubmenu();
  }

  // function called from above
  // function called from subElement
  removeSubmenu() {
    // removes search-item element
    this.__submenu.hideSubmenu();

    if (this.__searchItemElement !== undefined) {
      this.__searchItemElement.remove();
    }
  }

  __firstSearchFound() {
    // search the DB from hint (first barcode)
    // if matches only to one item then choose item directly and close the search-item
    // the barcode item must be same to the hint

    const matchedItems = [];

    // set the hint to lowercase
    this.__hint = this.__hint.toLowerCase();

    EXAMPLE_ITEMS_FROM_API.forEach((item) => {
      const isBarcodeMatch = item.barcode.toLowerCase() === this.__hint;

      if (isBarcodeMatch) matchedItems.push(item);
    });

    return matchedItems;
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

      // example of result
      // <div class="search-item-result-content">
      // <p class="item-barcode">${barcode}</p>
      // <p class="item-name">${name}</p>
      // <p class="item-type">${type}</p>
      // <p class="item-price">${price}</p>
      // </div>;

      const resultElement = document.createElement("div");
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
        const selectedItemIndexOnList = this.__matchedItemElements.indexOf(resultElement);

        this.__searchItem.selectedItem = {
          ...this.__matchedItemList[selectedItemIndexOnList],
        };
      });

      this.__resultsElement.appendChild(resultElement);
      this.__matchedItemElements.push(resultElement);
    });
  }

  get element() {
    return this.__resultsElement;
  }
}
