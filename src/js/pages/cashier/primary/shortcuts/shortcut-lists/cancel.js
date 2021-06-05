import { Submenu } from "./Submenu.js";
export class Cancel extends Submenu {
  constructor(submenu, submenuWrapper, submenuProperties) {
    super(submenu, submenuWrapper, submenuProperties);

    this._initializeSubmenu();
  }

  _setListener() {
    this.__yesButton.addEventListener("click", () => {
      this._submenu.cancelCurrentTransaction();
      this._submenu.hideSubmenu();
    });

    this.__noButton.addEventListener("click", () => {
      this._submenu.hideSubmenu();
    });
  }

  _setSubmenu() {
    this.__yesButton = this._submenuElement.querySelector(".option-yes");
    this.__noButton = this._submenuElement.querySelector(".option-no");
  }
}
