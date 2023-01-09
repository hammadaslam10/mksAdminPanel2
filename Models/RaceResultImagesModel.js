const Sequelize = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  const RaceResultImagesModel = sequelize.define(
    "RaceResultImagesModel",

    {
      _id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      RaceId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      image: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Please Add Image Of RaceResultImagesModel" },
          notEmpty: {
            msg: "Without Image RaceResultImagesModel Will not get submitted",
          },
        },
      },
      BackupId: {
        type: DataTypes.BIGINT,
        defaultValue: null,
      },
    },
    {
      freezeTableName: true,
      paranoid: true,
      initialAutoIncrement: 10,
    }
  );
  return RaceResultImagesModel;
};
