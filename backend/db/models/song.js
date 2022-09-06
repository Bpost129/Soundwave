'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Song extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Song.belongsTo(models.Album, { foreignKey: 'albumId' });
      Song.belongsTo(models.User, { foreignKey: 'userId' });
      Song.hasMany(models.Comment, { foreignKey: 'songId' });
      Song.hasMany(models.Playlist, { through: models.PlaylistSong });
    }
  }
  Song.init({
    // id: {
    //   type: DataTypes.INTEGER,
    //   primaryKey: true
    // },
    albumId: {
      type: DataTypes.INTEGER,
    },
    userId: {
      type: DataTypes.INTEGER,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    imageUrl: {
      type: DataTypes.STRING,
    },
  }, {
    sequelize,
    modelName: 'Song',
  });
  return Song;
};