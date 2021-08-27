"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class perubahan_detail_barang_attribute extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  perubahan_detail_barang_attribute.init(
    {
      deskripsi_attribute: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
    },
    {
      sequelize,
      timestamps: false,
      modelName: "perubahan_detail_barang_attribute",
      tableName: "perubahan_detail_barang_attribute",
    }
  );
  return perubahan_detail_barang_attribute;
};
