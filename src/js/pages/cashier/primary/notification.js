export class Notification {
  // notification type affects to color and icon will be used
  #notificationTypes = ["success", "warning", "error"];
  // icon list
  #iconTypes = ["fa-check-circle", "fa-exclamation-circle", "fa-exclamation-triangle"];

  #notificationElement;
  #notificationIcon;
  #notificationTextElement;

  #currentType;

  constructor(cashier) {
    this.cashier = cashier;

    this.#notificationElement = cashier.element.querySelector(".notification");
    this.#notificationIcon = this.#notificationElement.querySelector(".notification-icon");
    this.#notificationTextElement = this.#notificationElement.querySelector(".notification-text span.display-text");

    // test
    setInterval(() => {
      setTimeout(() => {
        this.setNotification(0, "Success");
        setTimeout(() => {
          this.setNotification(1, "Warning");
          setTimeout(() => {
            this.setNotification(2, "Error");
          }, 1000);
        }, 1000);
      }, 1000);
    }, 3000);
  }

  setNotification(type, text) {
    if (this.#currentType !== type) {
      // remove notification previous status
      this.#notificationElement.classList.remove(this.#notificationTypes[this.#currentType]);
      this.#notificationIcon.classList.remove(this.#iconTypes[this.#currentType]);

      // change the color and type
      this.#notificationElement.classList.add(this.#notificationTypes[type]);
      this.#notificationIcon.classList.add(this.#iconTypes[type]);

      this.#currentType = type;
    }

    this.#notificationTextElement.innerText = text;
  }
}
