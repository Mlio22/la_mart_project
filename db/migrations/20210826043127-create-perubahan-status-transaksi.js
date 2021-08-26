"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("perubahan_status_transaksi", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      id_transaksi_keseluruhan: {
        type: Sequelize.INTEGER,
        references: { model: "transaksi_keseluruhan", key: "id" },
        allowNull: false,
      },
      id_status_transaksi_before: {
        type: Sequelize.INTEGER,
        references: { model: "status_transaksi", key: "id" },
        allowNull: false,
      },
      id_status_transaksi_after: {
        type: Sequelize.INTEGER,
        references: { model: "status_transaksi", key: "id" },
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("perubahan_status_transaksi");
  },
};
