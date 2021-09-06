import { submenuButtons } from "./shortcuts-helper/shortcutList.js";

export class SubmenuWrapper {
  #openedSubmenu = null;
  #submenuCoverElement;
  #submenuWrapperElement;

  constructor(window) {
    this.window = window;

    this.#submenuCoverElement = window.element.querySelector(".submenuCover");
    this.#submenuWrapperElement = this.#submenuCoverElement.querySelector(".submenu");

    this.#listenEvent();
  }

  showSubmenu() {
    this.#submenuCoverElement.classList.remove("hidden");
  }

  hideSubmenu() {
    this.#submenuCoverElement.classList.add("hidden");
    this.#openedSubmenu = null;

    // clear the submenu element
    this.#submenuWrapperElement.innerHTML = "";

    // focus to latest item
    if (this.window.name === "cashier") {
      this.window.childs.transactionList.currentTransaction.transactionInfo.itemList.focusToLatestBarcode();
    } else if (this.window.name === "stock") {
      return this.window;
    }
  }

  //   opening a shortcut
  openSubmenu(shortcutKey, props = {}) {
    if (this.#openedSubmenu === null) {
      const { name, object, shortcutFunction, html } = submenuButtons[shortcutKey];
      const submenuProperties = {
        name: name,
        html: html,
      };

      if (object) {
        // create shortcut object
        this.#openedSubmenu = new object(this, submenuProperties, props);
      }

      if (shortcutFunction) {
        // execute shortcut function
        shortcutFunction(this);
      }
    }
  }

  #listenEvent() {
    // listening to cover,
    // when a submenu is showed, and the cover clicked, then the submenu will close
    this.#submenuCoverElement.addEventListener("click", (e) => {
      if (e.target === this.#submenuCoverElement) {
        this.hideSubmenu();
      }
    });

    // escape button listener
    this.window.element.addEventListener("keydown", ({ key }) => {
      if (this.#openedSubmenu && key === "Escape") {
        this.hideSubmenu();
      }
    });
  }

  get element() {
    return this.#submenuWrapperElement;
  }

  get openedSubmenu() {
    return this.#openedSubmenu;
  }
}
