export class Submenu {
  constructor(submenu, submenuWraper, submenuProperties) {
    this._submenu = submenu;
    this._submenuWrapper = submenuWraper;

    this._submenuName = submenuProperties.name;
    this._submenuHTML = submenuProperties.html;
  }

  //   start create submenu and add listener to it
  _initializeSubmenu() {
    // createSubmenu for creating HTML and append it to cover
    // setSubmenu for gather input selector and setting input values, etc (inherited)
    // setListener for setting listener (inherited)

    this._createSubmenu();
    this._setSubmenu();
    this._setListener();

    // showing the submenu
    this._submenu.showSubmenu();
  }

  _createSubmenu() {
    // inherited at payment and cancel
    // overrided at search-item
    // overrided at new-transaction

    // creating submenu element
    this._submenuElement = document.createElement("div");
    this._submenuElement.className = this._submenuName;
    this._submenuElement.innerHTML = this._submenuHTML;

    // add it to wrapper
    this._submenuWrapper.appendChild(this._submenuElement);
  }

  _setSubmenu() {}
  _setListener() {}
}
