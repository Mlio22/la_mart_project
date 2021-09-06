"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("transaksi_barang", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      id_barang: {
        type: Sequelize.INTEGER,
        references: { model: "detail_barang", key: "id" },
        allowNull: false,
      },
      id_transaksi_keseluruhan: {
        type: Sequelize.INTEGER,
        references: { model: "transaksi_keseluruhan", key: "id" },
        allowNull: false,
      },
      jumlah: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      total_harga: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      keuntungan: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("now"),
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("transaksi_barang");
  },
};
