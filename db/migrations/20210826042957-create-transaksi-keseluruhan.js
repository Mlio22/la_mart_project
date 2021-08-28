"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    console.log(Sequelize);
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
        defaultValue: 1,
      },
      total_harus_dibayar: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      dibayar_oleh_konsumen: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      kembalian: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      total_keuntungan: {
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
    await queryInterface.dropTable("transaksi_keseluruhan");
  },
};
