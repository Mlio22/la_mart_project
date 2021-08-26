"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class pemasukan_barang extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  pemasukan_barang.init(
    {
      id_stok_barang: DataTypes.INTEGER,
      jumlah: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "pemasukan_barang",
    }
  );
  return pemasukan_barang;
};
