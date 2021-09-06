"use strict";
const sequelize = require("../../helpers/sequelize");
const { DataTypes, Model } = require("sequelize");
class PengeluaranBarang extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    // define association here
  }
}
PengeluaranBarang.init(
  {
    id_stok_barang: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_alasan_pengeluaran: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    jumlah: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    updatedAt: false,
    modelName: "PengeluaranBarang",
    tableName: "pengeluaran_barang",
  }
);

module.exports = PengeluaranBarang;
