"use strict";
const sequelize = require("../../../helpers/sequelize");
const { DataTypes, Model } = require("sequelize");
class EditTransaksiBarang extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    // define association here
  }
}
EditTransaksiBarang.init(
  {
    id_transaksi_barang: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    content_before: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    content_after: {
      type: DataTypes.JSON,
      allowNull: false,
    },
  },
  {
    sequelize,
    updatedAt: false,
    modelName: "EditTransaksiBarang",
    tableName: "edit_transaksi_barang",
  }
);

module.exports = EditTransaksiBarang;
