"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("perubahan_detail_barang", {
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
      id_attribute_perubahan: {
        type: Sequelize.INTEGER,
        references: { model: "perubahan_detail_barang_attribute", key: "id" },
        allowNull: false,
      },
      content_before: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      content_after: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("perubahan_detail_barang");
  },
};
