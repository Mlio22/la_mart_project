import { SearchItem } from "../../cashier/primary/shortcuts-helper/shortcut-objects/searchItem.js";
// available submenus
// todo :
// search item
//
const AVAILABLE_SUBMENUS = { "search-item": SearchItem };

export class Submenu {
  constructor(stock) {
    this.stock = stock;
    this.submenuElement = this.stock.stockElement.querySelector(".submenu");

    this.activeSubmenu = null;
  }

  showSubmenu() {
    this.submenuElement.classList.remove("hidden");
  }

  terminateSubmenu() {
    this.submenuElement.classList.add("hidden");
    this.activeSubmenu = null;

    // clear the submenu element
    this.submenuElement.innerHTML = "";
  }

  openSubmenu(name, props = {}) {
    // terminate last submenu
    this.terminateSubmenu();

    this.activeSubmenu = new AVAILABLE_SUBMENUS[name](this, { name: "", html: "" }, props);
  }

  get element() {
    return this.submenuElement;
  }
}
