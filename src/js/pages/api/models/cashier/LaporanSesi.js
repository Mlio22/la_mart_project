"use strict";
const sequelize = require("../../helpers/sequelize");
const { DataTypes, Model } = require("sequelize");
class LaporanSesi extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    // define association here
  }
}
LaporanSesi.init(
  {
    total_pendapatan: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    total_keuntungan: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    updatedAt: false,
    modelName: "LaporanSesi",
    tableName: "laporan_per_sesi",
  }
);

module.exports = LaporanSesi;
