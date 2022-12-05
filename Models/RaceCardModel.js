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
          is: /(\w*[ء-ي]\w*)/gm,
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
