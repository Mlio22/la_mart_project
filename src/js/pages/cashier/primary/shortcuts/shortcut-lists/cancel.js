const cancelHTML = `<div class="header">Batalkan Transaksi?</div>
<div class="options">
    <div class="option-yes">
        <i class="fas fa-check"></i>Ya
    </div>
    <div class="option-no">
        <i class="fas fa-times"></i>Tidak
    </div>
</div>`;

export class Cancel {
  constructor(submenu, parentElement) {
    this.__submenu = submenu;
    this.__parentElement = parentElement;

    this.__setSubmenu();
    this.__listenCancel();
  }

  __listenCancel() {
    this.__yesButton.addEventListener("click", () => {
      this.__submenu.clearTransactionList();
      this.__submenu.hideSubmenu();
    });

    this.__noButton.addEventListener("click", () => {
      this.__submenu.hideSubmenu();
    });
  }

  __setSubmenu() {
    this.__cancelElement = document.createElement("div");
    this.__cancelElement.className = "cancel";
    this.__cancelElement.innerHTML = cancelHTML;

    // button elements
    this.__yesButton = this.__cancelElement.querySelector(".option-yes");
    this.__noButton = this.__cancelElement.querySelector(".option-no");

    this.__parentElement.appendChild(this.__cancelElement);
    this.__submenu.showSubmenu();
  }
}
