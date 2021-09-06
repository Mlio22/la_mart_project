"use strict";
const sequelize = require("../../helpers/sequelize");
const { DataTypes, Model } = require("sequelize");
class AlasanPerubahanStok extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    // define association here
  }
}
AlasanPerubahanStok.init(
  {
    deskripsi_alasan_perubahan_stok: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
  },
  {
    sequelize,
    timestamps: false,
    modelName: "AlasanPerubahanStok",
    tableName: "alasan_perubahan_stok",
  }
);
module.exports = AlasanPerubahanStok;
