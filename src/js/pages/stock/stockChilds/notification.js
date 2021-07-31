const notificationTypes = ["success", "warning", "error"];

export class Notification {
  constructor(cashier, notificationElement) {
    this.__cashier = cashier;

    this.__notificationElement = notificationElement;
    this.__notificationTextElement = this.__notificationElement.querySelector(".notification-text");

    this.__isNotificationShowing = false;
  }

  setNotification(type, text) {
    notificationTypes.forEach((notificationType) => {
      this.__notificationElement.classList.remove(notificationType);
    });

    this.__notificationElement.classList.add(notificationTypes[type]);
    this.__notificationTextElement.innerText = text;

    this.__isNotificationShowing = true;
  }
}
