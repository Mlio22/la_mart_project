"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class detail_barang extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  detail_barang.init(
    {
      barcode_barang: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      nama_barang: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true,
      },
      satuan_barang: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
    },
    {
      sequelize,
      updatedAt: false,
      modelName: "detail_barang",
      tableName: "detail_barang",
    }
  );
  return detail_barang;
};
