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
    id_status_transaksi: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    completedAt: {
      type: DataTypes.DATE,
    },
  },
  {
    sequelize,
    paranoid: true,
    modelName: "TransaksiKeseluruhan",
    tableName: "transaksi_keseluruhan",
  }
);

module.exports = TransaksiKeseluruhan;
