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
    this._submenuElement.addEventListener("keydown", (e) => {
      const key = e.key;
      if (key === "Tab") {
        this._submenuElement.focus();
        this.slider.toggleSlider();
        return;
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

    // gather children width and height
    this.#typeChilds = Array.prototype.slice.call(this.#typeSliderElement.children);
    this.#typeChilds.forEach((childs) => {
      this.#childOffsetWidth.push(childs.offsetWidth);
    });

    // set slider and listen
    this.#setSlider();
    this.#listenSlider();
  }

  toggleSlider() {
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
        .reduce((acc, cur, idx) => acc + cur + 7 * idx, 0);

    // change slider pos and width
    this.#sliderElement.style.width = `${sliderWidth}px`;
    this.#sliderElement.style.left = `${sliderLeft}px`;

    // change .active owner
    this.#typeSliderElement.querySelector(".active").classList.remove("active");
    this.#typeChilds[this.#currentTypeIndex].classList.add("active");

    // change results
    this.#submenu.result.getTransactionList(this.#currentTypeIndex);
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
        this.#arrowCollapseOrNot(this.#resultElements[this.#focusIndex].itemsElement, false);
        break;

      case "ArrowRight":
        this.#arrowCollapseOrNot(this.#resultElements[this.#focusIndex].itemsElement, true);
        break;
    }
  }

  getTransactionList(sliderIndex = 0) {
    // sliderIndex + 2 equal as transaction's status
    this.#currentFilteredTransactions = this.#submenu.cashier.childs.transactions.retrieveTransactionList(
      sliderIndex + 2
    );

    this.#showResults();
  }

  #showResults() {
    // refresh the results
    this.#resultElements = [];

    this.#openTransactionContentElement.innerHTML = `
    <div class="content-header">
      <div class="id">ID</div>
      <div class="item-bar">Jumlah Item</div>
      <div class="time">Waktu</div>
    </div>
    `;

    this.#currentFilteredTransactions.forEach(({ transactionInfo }) => {
      console.log(transactionInfo);
      const contentItem = document.createElement("div");
      contentItem.className = "content-item";
      contentItem.tabIndex = "0";
      contentItem.innerHTML = `
      <div class="id">#${transactionInfo.id}</div>
      <div class="item-bar">
          <div class="collapse-button-wrapper"><div class="collapse-button"></div></div>
          <div class="item-count">${transactionInfo.items.length} Item</div>
          <div class="item-list">${transactionInfo.items
            .map((item) => {
              return `<div class="item-list-child">- ${item.data.name}</div>`;
            })
            .join("")}</div>
      </div>
      <div class="time">11:02</div>`;

      this.#resultElements.push({ itemsElement: contentItem, collapsed: false });
      this.#openTransactionContentElement.appendChild(contentItem);
    });

    this.#listenInteraction();

    // bug fix: set a delay before focusing element
    setTimeout(() => {
      // initial focus index
      if (this.#resultElements.length > 0) {
        this.focusIndex = 0;
      }
    }, 50);
  }

  #listenInteraction() {
    this.#resultElements.forEach(({ itemsElement: resultElement }) => {
      const itemBar = resultElement.querySelector(".item-bar"),
        collapseButtonWrapper = itemBar.querySelector(".collapse-button-wrapper");

      // item expansion (mouse - single click)
      collapseButtonWrapper.addEventListener("click", () => {
        this.#arrowCollapseOrNot(resultElement, "toggle");
      });

      // result selection (mouse - double click)
      let beforeTimeoutDouble = false;

      resultElement.addEventListener("click", (e) => {
        this.focusIndex = this.#resultElements.findIndex(({ itemsElement }) => itemsElement === resultElement);

        if (
          e.target !== collapseButtonWrapper &&
          e.target !== collapseButtonWrapper.querySelector(".collapse-button")
        ) {
          if (beforeTimeoutDouble) {
            // item selected;
            this.#submenu.cashier.childs.transactions.loadTransaction(
              this.#currentFilteredTransactions[this.#focusIndex].transactionInfo.id
            );

            this.#submenu.cashier.childs.submenu.hideSubmenu();
          } else {
            beforeTimeoutDouble = true;

            // set timeout
            setTimeout(() => {
              beforeTimeoutDouble = false;
            }, 200);
          }
        }
      });

      resultElement.addEventListener("keydown", ({ key }) => {
        if (key === "Enter") {
          // select item
          this.#submenu.cashier.childs.transactions.loadTransaction(
            this.#currentFilteredTransactions[this.#focusIndex].transactionInfo.id
          );

          this.#submenu.cashier.childs.submenu.hideSubmenu();
        }
      });
    });
  }

  #arrowCollapseOrNot(itemsElement, collapse = false) {
    const itemBar = itemsElement.querySelector(".item-bar");

    if (itemBar.classList.contains("active")) {
      if (collapse === true) return;

      itemBar.classList.remove("active");
    } else {
      if (collapse === false) return;

      try {
        contentItem.querySelector(".item-bar.active").classList.remove("active");
      } catch (_) {
      } finally {
        itemBar.classList.add("active");
      }
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
