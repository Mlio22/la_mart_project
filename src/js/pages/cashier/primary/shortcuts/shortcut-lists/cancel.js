const cancelHTML = `<div class="cancel-transaction-header">Batalkan Transaksi?</div>
<div class="cancel-transaction-options">
    <div class="cancel-transaction-options__yes">
        <i class="fas fa-check"></i>Ya
    </div>
    <div class="cancel-transaction-options__no">
        <i class="fas fa-times"></i>Tidak
    </div>
</div>`

export class Cancel {
    constructor(parentElement, props) {
        this.__parentElement = parentElement;
        this.__parentElement.innerHTML = ``;

        this.__cancelElement = null;

        this.__setSubmenu()
    }

    __setSubmenu() {
        this.__cancelElement = document.createElement('div');
        this.__cancelElement.className = 'cancel';
        this.__cancelElement.innerHTML = cancelHTML;

        this.__parentElement.appendChild(this.__cancelElement);
    }
}