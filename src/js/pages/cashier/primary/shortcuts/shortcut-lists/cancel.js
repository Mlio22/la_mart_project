import { Submenu } from "./Submenu.js";
export class Cancel extends Submenu {
  #yesButton;
  #noButton;

  constructor(submenu, submenuWrapper, submenuProperties) {
    super(submenu, submenuWrapper, submenuProperties);

    this._initializeSubmenu();
  }

  _setListener() {
    this.#yesButton.addEventListener("click", () => {
      this._submenu.cashier.childs.transactions.cancelCurrentTransaction();
      this._submenu.hideSubmenu();
    });

    this.#noButton.addEventListener("click", () => {
      this._submenu.hideSubmenu();
    });
  }

  _setSubmenu() {
    this.#yesButton = this._submenuElement.querySelector(".option-yes");
    this.#noButton = this._submenuElement.querySelector(".option-no");
  }
}
