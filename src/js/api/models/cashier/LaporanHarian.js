"use strict";
const sequelize = require("../../helpers/sequelize");
const { DataTypes, Model } = require("sequelize");
class LaporanHarian extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    // define association here
  }
}
LaporanHarian.init(
  {
    total_pendapatan: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    total_keuntungan: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    tanggal: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    timestamps: false,
    modelName: "LaporanHarian",
    tableName: "laporan_harian",
  }
);

module.exports = LaporanHarian;
