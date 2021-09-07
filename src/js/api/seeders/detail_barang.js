"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.bulkInsert("detail_barang", [
        {
          barcode_barang: "222",
          nama_barang: "sambal abc",
          satuan_barang: "Botol",
          harga_beli: 20000,
          harga_jual: 21000,
        },
        {
          barcode_barang: "111",
          nama_barang: "sambal def",
          satuan_barang: "sashet",
          harga_beli: 2000,
          harga_jual: 2100,
        },
        {
          barcode_barang: "333",
          nama_barang: "sambal xyz",
          satuan_barang: "drum",
          harga_beli: 200000,
          harga_jual: 210000,
        },
      ]),
    ]);
  },
  down: (queryInterface, Sequelize) => {
    return Promise.all([queryInterface.bulkDelete("detail_barang", 1, {})]);
  },
};
