export class Shortcut {
  #shortcutWrapper;
  #shortcutKey;
  #shortcutClassname;
  #shortcutAvailablity;
  #shortcutElement;

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
  }

  set availability(availability) {
    this.#shortcutAvailablity = availability;

    // reset the element availability
    this.#setShortcutAvailability();
  }

  // listening to each shortcut button
  #listenShortcutElement() {
    this.#shortcutElement.addEventListener("click", () => {
      if (this.#shortcutAvailablity) {
        this.#shortcutWrapper.openSubmenu(this.#shortcutKey, {});
      }
    });
  }
}
