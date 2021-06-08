export class Shortcut {
  constructor(shortcutWrapper, shortcutKey, { name: shortcutClassname, initialAvailabiilty }) {
    this.__shortcutWrapper = shortcutWrapper;
    this.__shortcutKey = shortcutKey;

    this.__shortcutClassname = shortcutClassname;
    this.__shortcutAvailablity = initialAvailabiilty;

    this.__shortcutElement = document.querySelector(`.shortcut.${this.__shortcutClassname}`);

    this.__setShortcutAvailability();
    this.__listenShortcutElement();
  }

  __setShortcutAvailability() {
    this.__shortcutElement.className = `shortcut ${!this.__shortcutAvailablity ? "disabled" : ""}`;
  }

  set availability(availability) {
    this.__shortcutAvailablity = availability;

    // reset the element availability
    this.__setShortcutAvailability();
  }

  // listening to each shortcut button
  __listenShortcutElement() {
    this.__shortcutElement.addEventListener("click", () => {
      if (this.__shortcutAvailablity) {
        this.__shortcutWrapper.openSubmenu(this.__shortcutKey, {});
      }
    });
  }
}
