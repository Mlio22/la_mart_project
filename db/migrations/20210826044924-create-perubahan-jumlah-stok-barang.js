"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("perubahan_jumlah_stok_barang", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      id_stok_barang: {
        type: Sequelize.INTEGER,
        references: { model: "stok_barang", key: "id" },
      },
      id_alasan_perubahan_stok_barang: {
        type: Sequelize.INTEGER,
        references: { model: "alasan_perubahan_jumlah_stok", key: "id" },
      },
      jumlah_awal: {
        type: Sequelize.INTEGER,
      },
      jumlah_akhir: {
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
    await queryInterface.dropTable("perubahan_jumlah_stok_barang");
  },
};
