"use strict";
const sequelize = require("../../helpers/sequelize");
const { DataTypes, Model } = require("sequelize");

class DetailBarang extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    // define association here
  }
}

DetailBarang.init(
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
    harga_beli: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    harga_jual: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    satuan_barang: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
  },
  {
    sequelize,
    paranoid: true,
    modelName: "DetailBarang",
    tableName: "detail_barang",
  }
);

module.exports = DetailBarang;
