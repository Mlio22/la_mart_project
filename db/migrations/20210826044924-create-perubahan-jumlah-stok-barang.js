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
        allowNull: false,
      },
      id_alasan_perubahan_stok_barang: {
        type: Sequelize.INTEGER,
        references: { model: "alasan_perubahan_jumlah_stok", key: "id" },
        allowNull: false,
      },
      jumlah_awal: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      jumlah_akhir: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("perubahan_jumlah_stok_barang");
  },
};
