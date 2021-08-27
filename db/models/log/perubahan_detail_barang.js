"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class perubahan_detail_barang extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  perubahan_detail_barang.init(
    {
      id_barang: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      id_attribute_perubahan: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      content_before: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      content_after: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
    },
    {
      sequelize,
      updatedAt: false,
      modelName: "perubahan_detail_barang_attribute",
      tableName: "perubahan_detail_barang",
    }
  );
  return perubahan_detail_barang;
};
