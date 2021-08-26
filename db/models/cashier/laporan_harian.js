'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class laporan_harian extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  laporan_harian.init({
    total_pendapatan: DataTypes.INTEGER,
    total_keuntungan: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'laporan_harian',
  });
  return laporan_harian;
};