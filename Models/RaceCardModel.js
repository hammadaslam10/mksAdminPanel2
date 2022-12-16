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
          EnglishLanguageVerification() {
            if (this.RaceCardNameEn.trim() == "") {
              throw new Error("Please Enter Race Card Name in English ");
            }
            if (
              /^[a-zA-Z0-9$@$!%*?&#^-_.+]+$/.test(this.RaceCardNameEn) ||
              /^[a-zA-Z0-9$@$!%*?&#^-_. +]+$/.test(this.RaceCardNameEn)
            ) {
            } else {
              throw new Error("Race Card Name English Validation Failed");
            }
          },
        },
      },
      RaceCardNameAr: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          ArabicLanguageVerification() {
            if (this.RaceCardNameAr.trim() == "") {
              throw new Error("Please Enter  Race Card Name in  Arabic ");
            }
            if (
              /^[\u0621-\u064A\u0660-\u06690-9 ]+$/.test(this.RaceCardNameAr) ||
              /^[\u0621-\u064A\u0660-\u06690-9]+$/.test(this.RaceCardNameAr)
            ) {
            } else {
              throw new Error("Race Card Name Arabic Validation Failed");
            }
          },
        },
      },
      RaceCardCourse: {
        type: DataTypes.UUID,
        allowNull: false,
        notNull: { msg: "Please Add RaceCardCourse Of Race Card" },
        notEmpty: {
          msg: "Without RaceCardCourse Race Card Will not be get submit",
        },
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
