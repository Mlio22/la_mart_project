"use strict";
const sequelize = require("../../helpers/sequelize");
const { DataTypes, Model } = require("sequelize");
class StokBarang extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    // define association here
  }
}
StokBarang.init(
  {
    id_barang: {
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
    modelName: "StokBarang",
    tableName: "stok_barang",
  }
);

module.exports = StokBarang;
