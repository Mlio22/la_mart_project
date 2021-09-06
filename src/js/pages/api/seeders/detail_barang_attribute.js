"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("detail_barang_attribute", [
      { deskripsi_attribute: "barcode_barang" },
      { deskripsi_attribute: "nama_barang" },
      { deskripsi_attribute: "satuan_barang" },
      { deskripsi_attribute: "harga_beli" },
      { deskripsi_attribute: "harga_jual" },
    ]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("detail_barang_attribute", 1, {});
  },
};
