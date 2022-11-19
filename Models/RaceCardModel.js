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
          notNull: { msg: "Race Card will have RaceCardNameEn" },
          notEmpty: { msg: "RaceCardNameEn  will not be empty" },
        },
      },
      RaceCardNameAr: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          is: /^[\u0621-\u064A0-9 ]+$/,
          is: {
            msg: "RaceCardNameAr Must Be In Arabic",
          },
        },
      },
      RaceCardCourse: {
        type: DataTypes.UUID,
        allowNull: false,
        reference:{
          model: "RaceCourseModel",
          key: "_id",
        }
      },
    },
    {
      freezeTableName: true,
      paranoid: true,
    }
  );
  return RaceCardModel;
};
