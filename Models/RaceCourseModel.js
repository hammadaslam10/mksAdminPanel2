const Sequelize = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  const RaceCourseModel = sequelize.define(
    "RaceCourseModel",

    {
      _id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      image: {
        type: DataTypes.STRING,
        // allowNull: false,
        // notNull: { msg: "Please Add Image Of Race Course" },
        // notEmpty: {
        //   msg: "Without Image Race Course Will not get submitted",
        // },
      },
      TrackNameEn: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          EnglishLanguageVerification() {
            if (this.TrackNameEn.trim() == "") {
              throw new Error("Please Enter Track Name in English ");
            }
            if (
              /^[a-zA-Z0-9$-@!%*?&#^_.+]+$/.test(this.TrackNameEn) ||
              /^[a-zA-Z0-9$-@!%*?&#^_. +]+$/.test(this.TrackNameEn)
            ) {
            } else {
              throw new Error("Track Name English Validation Failed");
            }
          },
        },
      },
      TrackNameAr: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          ArabicLanguageVerification() {
            if (this.TrackNameAr.trim() == "") {
              throw new Error("Please Enter  Track Name in  Arabic ");
            }
            if (
              /^[a-zA-Z0-9$-@$!%*?&#^-_,،.+\u0621-\u064A\u0660-\u0669 ]+$/.test(
                this.TrackNameAr
              ) ||
              /^[\u0621-\u064A\u0660-\u06690-9a-zA-Z0-9$-@$!%*?&#^-_.+]+$/.test(
                this.TrackNameAr
              )
            ) {
            } else {
              throw new Error("Track Name Arabic Validation Failed");
            }
          },
        },
      },

      NationalityID: {
        type: DataTypes.UUID,
        allowNull: false,
        validate: {
          notNull: { msg: "Please Add Nationality Of Race Course" },
          notEmpty: {
            msg: "Without Nationality Race Course Will not get submitted",
          },
        },
      },
      ColorCode: {
        type: DataTypes.UUID,
        allowNull: false,
        validate: {
          notNull: { msg: "Please Add ColorCode Of Race Course" },
          notEmpty: {
            msg: "Without ColorCode Race Course Will not get submitted",
          },
        },
      },
      shortCode: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        unique: true,
        allowNull: false,
        validate: {
          notNull: { msg: "RaceCourse will have shortCode" },
          notEmpty: { msg: "shortCode  will not be empty" },
        },
      },
      AbbrevEn: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          EnglishLanguageVerification() {
            if (this.AbbrevEn.trim() == "") {
              throw new Error("Please Enter Abbreviation Name in English");
            }
            if (
              /^[a-zA-Z0-9$-@!%*?&#^_.+]+$/.test(this.AbbrevEn) ||
              /^[a-zA-Z0-9$-@!%*?&#^_. +]+$/.test(this.AbbrevEn)
            ) {
            } else {
              throw new Error("Abbreviation Name English Validation Failed");
            }
          },
        },
      },
      AbbrevAr: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          ArabicLanguageVerification() {
            if (this.AbbrevAr.trim() == "") {
              throw new Error("Please Enter  Abbreviation in  Arabic ");
            }
            if (
              /^[a-zA-Z0-9$-@$!%*?&#^-_,،.+\u0621-\u064A\u0660-\u0669 ]+$/.test(
                this.AbbrevAr
              ) ||
              /^[\u0621-\u064A\u0660-\u06690-9a-zA-Z0-9$-@$!%*?&#^-_.+]+$/.test(
                this.AbbrevAr
              )
            ) {
            } else {
              throw new Error("Abbreviation Arabic Validation Failed");
            }
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
  return RaceCourseModel;
};
