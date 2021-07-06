import { submenuButtons } from "./shortcuts-helper/shortcutList.js";
import { Shortcut } from "./shortcuts-helper/shortcut.js";

export class ShortcutWrapper {
  #shortcuts = {};
  #openedSubmenu = null;

  constructor(cashier) {
    this.cashier = cashier;
    this.shortcutElement = cashier.element.querySelector(".shortcuts");
    this.submenuCoverElement = cashier.element.querySelector(".submenuCover");

    this.submenuWrapperElement = this.submenuCoverElement.querySelector(".submenu");

    this.#setShortcuts();
    this.#listenEvent();
  }

  //   opening a shortcut
  openSubmenu(shortcutKey, props = {}) {
    const { name, object, html } = submenuButtons[shortcutKey];
    const submenuProperties = {
      name: name,
      html: html,
    };

    // create shortcut object
    this.#openedSubmenu = new object(this, this.submenuWrapperElement, submenuProperties, props);
  }

  showSubmenu() {
    //!   this method only called by child submenu
    this.submenuCoverElement.classList.remove("hidden");
  }

  hideSubmenu() {
    this.submenuCoverElement.classList.add("hidden");
    this.#openedSubmenu = null;

    // clear the submenu element
    this.submenuWrapperElement.innerHTML = "";

    this.cashier.focusToCashier();
  }

  setShortcutAvailability(keyAndAvailablity) {
    // this.#shortcuts[shortcutKey].availability = availability;
    Object.keys(keyAndAvailablity).forEach((shortcutKey) => {
      this.#shortcuts[shortcutKey].availability = keyAndAvailablity[shortcutKey];
    });
  }

  #setShortcuts() {
    Object.keys(submenuButtons).forEach((key) => {
      console.log(submenuButtons[key]);
      this.#shortcuts[key] = new Shortcut(this, key, submenuButtons[key]);
    });
  }

  #listenEvent() {
    // listening to cover,
    // when a submenu is showed, and the cover clicked, then the submenu will close
    this.submenuCoverElement.addEventListener("click", (e) => {
      if (e.target === this.submenuCoverElement) {
        this.hideSubmenu();
      }
    });

    //! prevent other focus when submenu opened

    document.querySelector(".cashier .submenuCover").addEventListener("focusout", (e) => {
      if (e.relatedTarget !== null) {
        const { tagName: relatedTagName, className: relatedClassName } = e.relatedTarget;

        // checking targeted focusout is child of submenu
        try {
          if (document.querySelector(`.submenuCover ${relatedTagName}.${relatedClassName}`) === null) {
            this.hideSubmenu();
          }
        } catch (_) {
          this.hideSubmenu();
        }
      }
    });

    // set cashier shortcut key listeners
    // called by cashier
    this.cashier.element.addEventListener("keydown", ({ key }) => {
      if (this.#openedSubmenu === null && submenuButtons[key]) {
        this.openSubmenu(key);
      }

      if (this.#openedSubmenu && key === "Escape") {
        this.hideSubmenu();
      }
    });
  }
}
