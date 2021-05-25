const openTransactionHTML = `
        <div class="open-transaction-header">
            <p class="header-text">Buka Transaksi</p>
        </div>

        <div class="open-transaction-table">
            <div class="open-transaction-table__header">
                <div class="open-transaction-table__header__item id">ID</div>
                <div class="open-transaction-table__header__item count">Jumlah Barang</div>
            </div>
            <div class="open-transaction-table__contents">
                <div class="open-transaction-table__contents__item id">000001</div>
                <div class="open-transaction-table__contents__item count">20</div>
            </div>
            <div class="open-transaction-table__contents">
                <div class="open-transaction-table__contents__item id">000001</div>
                <div class="open-transaction-table__contents__item count">20</div>
            </div>
            <div class="open-transaction-table__contents">
                <div class="open-transaction-table__contents__item id">000001</div>
                <div class="open-transaction-table__contents__item count">20</div>
            </div>
            <div class="open-transaction-table__contents">
                <div class="open-transaction-table__contents__item id">000001</div>
                <div class="open-transaction-table__contents__item count">20</div>
            </div>
        </div>
    `;

export class OpenTransaction {
    constructor(parentElement, props) {
        this.__parentElement = parentElement;
        this.__parentElement.innerHTML = '';
        this.__setSubmenu();
    }

    __setSubmenu() {
        this.__openTransactionElement = document.createElement('div');
        this.__openTransactionElement.className = 'open-transaction';
        this.__openTransactionElement.innerHTML = openTransactionHTML;

        this.__parentElement.appendChild(this.__openTransactionElement);
    }

}