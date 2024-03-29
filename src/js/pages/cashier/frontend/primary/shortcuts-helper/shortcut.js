/**
 * @typedef {import('../shortcutWrapper').ShortcutWrapper} ShortcutWrapper
 */

export class Shortcut {
  #shortcutWrapper;
  #shortcutKey;
  #shortcutClassname;
  #shortcutAvailablity;
  #shortcutElement;

  /**
   *
   * @param {ShortcutWrapper} shortcutWrapper - referenced ShortcutWrapper
   * @param {string} shortcutKey
   *
   * @param {Object} shortcutDetails
   * @param {string} shortcutDetails.name - shortcut's name
   * @param {boolean} shortcutDetails.initialAvailabiilty
   */

  constructor(shortcutWrapper, shortcutKey, { name: shortcutClassname, initialAvailabiilty }) {
    this.#shortcutWrapper = shortcutWrapper;
    this.#shortcutKey = shortcutKey;

    this.#shortcutClassname = shortcutClassname;
    this.#shortcutAvailablity = initialAvailabiilty;

    this.#shortcutElement = document.querySelector(`.shortcut.${this.#shortcutClassname}`);

    this.#setShortcutAvailability();
    this.#listenShortcutElement();
  }

  #setShortcutAvailability() {
    this.#shortcutElement.className = `shortcut ${!this.#shortcutAvailablity ? "disabled" : ""}`;
    this.#shortcutElement.setAttribute("tabindex", this.#shortcutAvailablity ? "0" : "");
  }

  // listening to each shortcut button
  #listenShortcutElement() {
    this.#shortcutElement.addEventListener("click", () => {
      if (this.#shortcutAvailablity) {
        this.#shortcutWrapper.cashier.childs.submenu.openSubmenu(this.#shortcutKey, {});
      }
    });

    this.#shortcutElement.addEventListener("keydown", (e) => {
      if (this.#shortcutAvailablity && e.key === "Enter") {
        this.#shortcutWrapper.cashier.childs.submenu.openSubmenu(this.#shortcutKey, {});
      }
    });
  }

  set availability(availability) {
    this.#shortcutAvailablity = availability;

    // reset the element availability
    this.#setShortcutAvailability();
  }

  /**
   * @returns {Boolean}
   */
  get availability() {
    return this.#shortcutAvailablity;
  }
}
