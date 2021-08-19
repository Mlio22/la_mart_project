import { Submenu } from "./SubmenuPrototype.js";

export class OpenTransaction extends Submenu {
  constructor(submenuWrapper, submenuProperties) {
    super(submenuWrapper, submenuProperties);
    this._initializeSubmenu();

    this._submenuElement.tabIndex = "0";

    this.result = new ResultTransactions(this);
    this.slider = new TypeSlider(this);

    this.#listen();
  }

  #listen() {
    this._submenuElement.addEventListener("keydown", ({ key }) => {
      if (key === "Tab") {
        this._submenuElement.focus();
        this.slider.toggleSlider();
      } else if (key.includes("Arrow")) {
        this.result.arrowAction(key);
      }
    });
  }
}

class TypeSlider {
  #submenu;

  #currentTypeIndex = 0;
  #typeSliderElement;
  #sliderElement;

  #typeChilds;

  // childs outset widths
  #childOffsetWidth = [];

  constructor(submenu) {
    this.#submenu = submenu;

    this.#typeSliderElement = submenu.element.querySelector(".type-slider");
    this.#sliderElement = submenu.element.querySelector(".slider");

    // gather children width
    this.#gatherChildrenWidth();

    // set slider and listen
    this.#setSlider();
    this.#listenSlider();
  }

  toggleSlider() {
    // toggle slider
    // called from parent (OpenTransaction)
    const previousIndex = this.#currentTypeIndex;

    this.#currentTypeIndex = previousIndex === 0 ? 1 : 0;
    this.#setSlider();
  }

  #listenSlider() {
    this.#typeChilds.forEach((typeElement) => {
      typeElement.addEventListener("click", (e) => {
        const typeIndex = this.#typeChilds.findIndex((childs) => childs === e.target);

        if (this.#currentTypeIndex !== typeIndex) {
          this.#currentTypeIndex = typeIndex;
          this.#setSlider();
        }
      });
    });
  }

  #setSlider() {
    let sliderWidth = this.#childOffsetWidth[this.#currentTypeIndex],
      sliderLeft = this.#childOffsetWidth
        .slice(0, this.#currentTypeIndex)
        .reduce((sum, currentValue, currentIndex) => sum + (currentValue + 7 * currentIndex), 0);

    // change slider pos and width
    this.#sliderElement.style.width = `${sliderWidth}px`;
    this.#sliderElement.style.left = `${sliderLeft}px`;

    // change .active owner
    this.#typeSliderElement.querySelector(".active").classList.remove("active");
    this.#typeChilds[this.#currentTypeIndex].classList.add("active");

    // change results
    this.#submenu.result.getTransactionList(this.#currentTypeIndex);
  }

  #gatherChildrenWidth() {
    this.#typeChilds = Array.prototype.slice.call(this.#typeSliderElement.children);
    this.#childOffsetWidth = this.#typeChilds.map((child) => child.offsetWidth);
  }
}

class ResultTransactions {
  #submenu;
  #currentFilteredTransactions = [];
  #openTransactionContentElement;

  #resultElements = [];

  #focusIndex = 0;

  constructor(submenu) {
    this.#submenu = submenu;
    this.#openTransactionContentElement = submenu.element.querySelector(".content");

    this.#listenInteraction();
  }

  arrowAction(arrowKey) {
    switch (arrowKey) {
      case "ArrowUp":
        this.focusIndex = --this.#focusIndex;
        break;

      case "ArrowDown":
        this.focusIndex = ++this.#focusIndex;
        break;

      case "ArrowLeft":
        this.#arrowCollapseOrNot("close");
        break;

      case "ArrowRight":
        this.#arrowCollapseOrNot("open");
        break;
    }
  }

  getTransactionList(sliderIndex = 0) {
    // sliderIndex + 2 equal as transaction's status
    this.#currentFilteredTransactions =
      this.#submenu.window.childs.transactionList.retrieveTransactionList(sliderIndex + 2);

    this.#showResults();
  }

  #showResults() {
    // reset the HTML of content
    this.#openTransactionContentElement.innerHTML = `
    <div class="content-header">
      <div class="id">ID</div>
      <div class="item-bar">Jumlah Item</div>
      <div class="time">Waktu</div>
    </div>
    `;

    // create the result elements
    this.#createResultElements();

    // listen on each result elements
    this.#listenInteraction();

    // bug fix: set a delay before focusing element
    setTimeout(() => {
      // initial focus index
      if (this.#resultElements.length > 0) {
        this.focusIndex = 0;
      }
    }, 50);
  }

  #createResultElements() {
    // refresh the results element
    this.#resultElements = [];

    this.#resultElements = this.#currentFilteredTransactions.map(({ transactionInfo }) => {
      const contentItem = document.createElement("div");
      contentItem.className = "content-item";
      contentItem.tabIndex = "0";

      const items = transactionInfo.itemList.items;

      contentItem.innerHTML = `
      <div class="id">#${transactionInfo.id}</div>
      <div class="item-bar">
          <div class="collapse-button-wrapper"><div class="collapse-button"></div></div>
          <div class="item-count">${items.length} Item</div>
          <div class="item-list">${items
            .map((item) => {
              return `<div class="item-list-child">- ${item.data.name}</div>`;
            })
            .join("")}</div>
      </div>
      <div class="time">11:02</div>`;
      this.#openTransactionContentElement.appendChild(contentItem);

      return { itemsElement: contentItem, collapsed: false };
    });
  }

  #listenInteraction() {
    this.#resultElements.forEach(({ itemsElement: resultElement }) => {
      const itemBar = resultElement.querySelector(".item-bar");

      //* item list toggle collapse (mouse - single click)
      const collapseButtonWrapper = itemBar.querySelector(".collapse-button-wrapper");
      collapseButtonWrapper.addEventListener("click", () => {
        this.#arrowCollapseOrNot("toggle", resultElement);
      });

      //* result selection (mouse - double click)
      let beforeTimeoutDouble = false;
      resultElement.addEventListener("click", (e) => {
        this.focusIndex = this.#resultElements.findIndex(
          ({ itemsElement }) => itemsElement === resultElement
        );

        if (
          e.target !== collapseButtonWrapper &&
          e.target !== collapseButtonWrapper.querySelector(".collapse-button")
        ) {
          if (beforeTimeoutDouble) {
            // select item
            this.#selectTransactionAndClose();
          } else {
            beforeTimeoutDouble = true;

            // set timeout
            setTimeout(() => {
              beforeTimeoutDouble = false;
            }, 200);
          }
        }
      });

      //* result selection (keydown - enter)
      resultElement.addEventListener("keydown", ({ key }) => {
        if (key === "Enter") {
          // select item
          this.#selectTransactionAndClose();
        }
      });
    });
  }

  #selectTransactionAndClose() {
    // item selected;
    this.#submenu.window.childs.transactionList.loadTransaction(
      this.#currentFilteredTransactions[this.#focusIndex].transactionInfo.id
    );

    this.#submenu.window.childs.submenu.hideSubmenu();
  }

  #arrowCollapseOrNot(
    collapseTarget = "close",
    itemsElement = this.#resultElements[this.#focusIndex].itemsElement
  ) {
    //* collapse parameter values:
    // "close": about to close the collapse
    // "open": about to open the collapse
    // "toggle": toggle the collapse

    const itemBar = itemsElement.querySelector(".item-bar"),
      isCollapsed = itemBar.classList.contains("active");

    if (isCollapsed === true && collapseTarget === "close") {
      itemBar.classList.remove("active");
    }

    if (isCollapsed === false && collapseTarget === "open") {
      itemBar.classList.add("active");
    }

    if (collapseTarget === "toggle") {
      itemBar.classList.toggle("active");
    }
  }

  set focusIndex(focusIndex) {
    this.#focusIndex = focusIndex;

    if (this.#focusIndex > this.#resultElements.length - 1) {
      this.#focusIndex = 0;
    } else if (this.#focusIndex < 0) {
      this.#focusIndex = this.#resultElements.length - 1;
    }

    this.#resultElements[this.#focusIndex].itemsElement.focus();
  }
}
