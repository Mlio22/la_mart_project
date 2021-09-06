"use strict";

const sequelize = require("../../helpers/sequelize");
const { DataTypes, Model } = require("sequelize");
class PerubahanDetailBarang extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    // define association here
  }
}
PerubahanDetailBarang.init(
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
    modelName: "PerubahanDetailBarang",
    tableName: "perubahan_detail_barang",
  }
);

module.exports = PerubahanDetailBarang;
