'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Album extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Album.belongsTo(models.User, { foreignKey: 'userId'});
      Album.hasMany(models.Song, { foreignKey: 'albumId' })
    }
  }
  Album.init({
    // id: {
    //   type: DataTypes.INTEGER,
    //   primaryKey: true
    // },
    userId: {
      type: DataTypes.INTEGER,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'Album',
  });
  return Album;
};