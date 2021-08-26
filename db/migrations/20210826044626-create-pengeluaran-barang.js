"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("pengeluaran_barang", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      id_stok_barang: {
        type: Sequelize.INTEGER,
        references: { model: "detail_barang", key: "id" },
      },
      id_alasan_pengeluaran: {
        type: Sequelize.INTEGER,
        references: { model: "alasan_pengeluaran", key: "id" },
      },
      jumlah: {
        type: Sequelize.INTEGER,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("pengeluaran_barang");
  },
};
