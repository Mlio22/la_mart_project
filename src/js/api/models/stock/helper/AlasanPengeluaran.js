"use strict";
const sequelize = require("../../../helpers/sequelize");
const { DataTypes, Model } = require("sequelize");
class AlasanPengeluaran extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    // define association here
  }
}
AlasanPengeluaran.init(
  {
    deskripsi_alasan_pengeluaran: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
  },
  {
    sequelize,
    timestamps: false,
    modelName: "AlasanPengeluaran",
    tableName: "alasan_pengeluaran",
  }
);

module.exports = AlasanPengeluaran;
