"use strict";
const sequelize = require("../../helpers/sequelize");
const { DataTypes, Model } = require("sequelize");
class TransaksiKeseluruhan extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    // define association here
  }
}
TransaksiKeseluruhan.init(
  {
    log: {
      type: DataTypes.JSON,
      allowNull: false,
    },
  },
  {
    sequelize,
    paranoid: true,
    updatedAt: false,
    modelName: "TransaksiKeseluruhan",
    tableName: "transaksi_keseluruhan",
  }
);

module.exports = TransaksiKeseluruhan;
