"use strict";
const sequelize = require("../../../helpers/sequelize");
const { DataTypes, Model } = require("sequelize");
class DetailBarangAttribute extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    // define association here
  }
}
DetailBarangAttribute.init(
  {
    deskripsi_attribute: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
  },
  {
    sequelize,
    timestamps: false,
    modelName: "DetailBarangAttribute",
    tableName: "detail_barang_attribute",
  }
);

module.exports = DetailBarangAttribute;
