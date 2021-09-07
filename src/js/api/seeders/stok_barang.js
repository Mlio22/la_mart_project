"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.bulkInsert("stok_barang", [
        {
          id_barang: 1,
          jumlah: 20,
        },
        {
          id_barang: 2,
          jumlah: 10,
        },
        {
          id_barang: 3,
          jumlah: 1,
        },
      ]),
    ]);
  },
  down: (queryInterface, Sequelize) => {
    return Promise.all([queryInterface.bulkDelete("stok_barang", 1, {})]);
  },
};
