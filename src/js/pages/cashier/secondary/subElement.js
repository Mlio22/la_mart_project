import { SearchItem } from "./searchItem.js";

// sub element is a element for making ui
// search-item, payment, cancelling transactions, open-transaction and others

const SUBMENUS = {
  "search-item": SearchItem,
};

export class SubElement {
  constructor(cashier, submenuCoverElement) {
    this.__cashier = cashier;
    this.__submenuCoverElement = submenuCoverElement;

    // submenuElement will be used for other submenus
    this.__submenuElement =
      this.__submenuCoverElement.querySelector(".submenu");

    // submenu related properties
    this.__currentSubmenu = null;

    // when submenu is showed,
    // listen to cover to close the submenu when clicked
  }

  // listen to cover when submenu showed
  __listenCover() {
    this.__submenuCoverElement.addEventListener("click", (e) => {
      if (e.target === this.__submenuCoverElement) {
        this.hideSubmenu();
        this.__currentSubmenu.removeSubmenu();
        this.__currentSubmenu = null;
      }
    });
  }

  //   show/hide submenu
  showSubmenu() {
    this.__submenuCoverElement.classList.remove("hidden");
    this.__listenCover();
  }

  hideSubmenu() {
    this.__submenuCoverElement.classList.add("hidden");
  }

  // function called from above to below
  createSubmenu(submenuName, params) {
    // used in cashier
    if (this.__currentSubmenu !== null) {
      this.__currentSubmenu.removeSubmenu();
    }
    this.__currentSubmenu = new SUBMENUS[submenuName](
      this,
      this.__submenuElement,
      params
    );
  }

  // function called from below to above

  // function to transaction
  // function called from search-item
  createNewItem(itemData) {
    this.__cashier.createNewItem(itemData);
  }
}
