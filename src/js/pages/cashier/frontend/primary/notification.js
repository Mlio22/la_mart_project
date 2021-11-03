/**
 * @typedef {import ("../main").CashierUI} CashierUI
 */

export class Notification {
  #notificationIcons = {
    success: `<i class="notification-icon fas fa-check-circle"></i>`,
    warning: `<i class="notification-icon fas fa-exclamation-triangle"></i>`,
    error: `<i class="notification-icon fas fa-exclamation-circle"></i>`,
  };

  /**
   * contains notification element wrapper
   * @type {HTMLElement}
   * @private
   */
  #notificationWrapper;

  /**
   * contains notification element
   * @type {HTMLElement}
   * @private
   */
  #notificationElement;

  /**
   * contains notification text element
   * @type {HTMLElement}
   * @private
   */

  #notificationTextElement;

  /**
   * contains current showing notification timeout function
   */
  #currentNotificationTimeout = null;

  /**
   * @private
   */
  #currentNotificationType = null;

  #notificationIdle = false;

  /**
   *
   * @param {CashierUI} cashier
   */
  constructor(cashier) {
    this.cashier = cashier;
  }

  init() {
    this.#notificationWrapper = this.cashier.element.querySelector(".notifications-bar");
  }

  #listenNotificationElement() {
    this.#notificationElement.addEventListener("click", () => {
      if (this.#notificationIdle) {
        this.#removeNotification();
      }
    });
  }

  #removeNotification() {
    this.#notificationIdle = false;

    if (this.#currentNotificationTimeout) {
      clearTimeout(this.#currentNotificationTimeout);
      this.#currentNotificationTimeout = null;
    }

    this.#notificationElement.classList.add("dissapearing");

    this.#currentNotificationTimeout = setTimeout(() => {
      this.#notificationElement.remove();
    }, 1000);
  }

  setNotification(type, text) {
    console.log(text);
    if (this.#currentNotificationTimeout !== null) {
      // clear last timeout
      clearTimeout(this.#currentNotificationTimeout);

      // remove disappearing class if available
      if (this.#notificationElement.classList.contains("dissapearing")) {
        this.#notificationElement.classList.remove("dissapearing");
      }

      // update classname
      this.#notificationElement.classList.remove(this.#currentNotificationType);
      this.#notificationElement.classList.add(type);

      // update text
      this.#notificationTextElement.innerHTML = this.#notificationIcons[type] + text;
    } else {
      this.#notificationWrapper.innerHTML = "";

      this.#notificationElement = document.createElement("div");
      this.#notificationElement.className = `notification ${type}`;

      this.#notificationTextElement = document.createElement("p");
      this.#notificationTextElement.className = "notification-text";
      this.#notificationTextElement.innerHTML = this.#notificationIcons[type] + text;

      this.#notificationElement.appendChild(this.#notificationTextElement);
      this.#notificationWrapper.appendChild(this.#notificationElement);

      this.#listenNotificationElement();
    }

    this.#notificationIdle = true;
    this.#currentNotificationTimeout = setTimeout(() => {
      this.#currentNotificationTimeout = null;
      this.#removeNotification();
    }, 3000);
  }
}
