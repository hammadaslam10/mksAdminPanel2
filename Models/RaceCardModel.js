const Sequelize = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  const RaceCardModel = sequelize.define(
    "RaceCardModel",

    {
      _id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      RaceCardNameEn: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          is: /^[a-z][a-z0-9]*[a-z0-9\s]*[a-z\s]*$/i,
          is: {
            msg: "Title English Must Be In English",
          },
          notNull: { msg: "Race Card will have RaceCardNameEn" },
          notEmpty: { msg: "RaceCardNameEn  will not be empty" },
        },
      },
      RaceCardNameAr: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          is: /^[\u0621-\u064A\u0660-\u0669\d\s]+$/m,
          is: {
            msg: "RaceCardNameAr Must Be In Arabic",
          },
        },
      },
      RaceCardCourse: {
        type: DataTypes.UUID,
        allowNull: false,
      },
    },
    {
      freezeTableName: true,
      paranoid: true,
      initialAutoIncrement: 1000,
    }
  );
  return RaceCardModel;
};
