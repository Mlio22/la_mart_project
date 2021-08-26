'use strict';
const {
  Model
} = require('sequelize');
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
  };
  perubahan_detail_barang.init({
    id_barang: DataTypes.INTEGER,
    id_attribute_perubahan: DataTypes.INTEGER,
    content_before: DataTypes.STRING,
    content_after: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'perubahan_detail_barang',
  });
  return perubahan_detail_barang;
};