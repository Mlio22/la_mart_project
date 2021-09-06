const EXAMPLE_ITEMS_FROM_API = [
  {
    barcode: "121",
    name: "A",
    quantity: "Kotak",
    price: 200000,
    valid: true,
  },
  {
    barcode: "132",
    name: "B",
    quantity: "Box",
    price: 10000,
    valid: true,
  },
  {
    barcode: "221",
    name: "C",
    quantity: "Sachet",
    price: 2000,
    valid: true,
  },
  {
    barcode: "222",
    name: "C",
    quantity: "Bungkus",
    price: 21000,
    valid: true,
  },
  {
    barcode: "231",
    name: "D",
    quantity: "Pcs",
    price: 10500,
    valid: true,
  },
];

const EXAMPLE_ITEMS_FOR_STOCK = [
  {
    barcode: "221",
    name: "sambal ABC",
    quantity: "Botol",
    buyPrice: 20000,
    sellPrice: 21500,
    stock: 10,
  },
  {
    barcode: "222",
    name: "Sambal DEF",
    quantity: "Sachet",
    buyPrice: 2000,
    sellPrice: 2100,
    stock: 30,
  },
];

export const APIs = {
  cashier: EXAMPLE_ITEMS_FROM_API,
  stock: EXAMPLE_ITEMS_FOR_STOCK,
};

export class APIAccess {}
