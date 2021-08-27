"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class stok_barang extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  stok_barang.init(
    {
      id_barang: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      jumlah: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      harga: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "stok_barang",
      tableName: "stok_barang",
    }
  );
  return stok_barang;
};
