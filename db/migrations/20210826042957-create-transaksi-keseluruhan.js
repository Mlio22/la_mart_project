"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("transaksi_keseluruhan", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      id_status_transaksi: {
        type: Sequelize.INTEGER,
        references: { model: "status_transaksi", key: "id" },
      },
      total_harus_dibayar: {
        type: Sequelize.INTEGER,
      },
      dibayar_oleh_konsumen: {
        type: Sequelize.INTEGER,
      },
      kembalian: {
        type: Sequelize.INTEGER,
      },
      total_keuntungan: {
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
    await queryInterface.dropTable("transaksi_keseluruhan");
  },
};
