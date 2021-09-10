"use strict";
const sequelize = require("../../../helpers/sequelize");
const { DataTypes, Model } = require("sequelize");
class StatusBarang extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    // define association here
  }
}
StatusBarang.init(
  {
    deskripsi_status: { type: DataTypes.STRING(20), allowNull: false },
  },
  {
    sequelize,
    timestamps: false,
    modelName: "StatusBarang",
    tableName: "status_barang",
  }
);

module.exports = StatusBarang;
