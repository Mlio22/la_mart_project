import { Payment } from './payment.js';
import { Cancel } from './shortcut-lists/cancel.js';
import { OpenTransaction } from './openTransaction.js'
import { SearchItem } from './searchItem.js';

export const submenuButtons = [{
        name: 'search item',
        channel: 'search-item',
        element: '.shortcut.search-item',
        object: SearchItem,
    },
    {
        name: 'payment',
        channel: 'open-payment',
        element: '.shortcut.open-payment',
        object: Payment,
    },
    {
        name: 'print bill',
        channel: 'print-bill',
        element: '.shortcut.print-bill',
    },
    {
        name: 'save transaction',
        channel: 'save-transaction',
        element: '.shortcut.save-transaction',
    },
    {
        name: 'open transaction',
        channel: 'open-transaction',
        element: '.shortcut.open-transaction',
        object: OpenTransaction
    },
    {
        name: 'cancel transaction',
        channel: 'cancel-transaction',
        element: '.shortcut.cancel-transaction',
        object: Cancel,
    },
    {
        name: 'close cashier',
        channel: 'close-cashier',
        element: '.shortcut.close-cashier',
    },
    {
        name: 'new page',
        channel: 'new-page',
        element: '.shortcut.new-page',
    },
    {
        name: 'check balance',
        channel: 'check-balance',
        element: '.shortcut.check-balance',
    },
]