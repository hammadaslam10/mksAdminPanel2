const Sequelize = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  const NationalityModel = sequelize.define(
    "NationalityModel",

    {
      _id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      NameEn: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          EnglishLanguageVerification() {
            if (this.NameEn.trim() == "") {
              throw new Error("Please Enter Name in English ");
            }
            if (
              /^[a-zA-Z0-9$@$!%*?&#^-_.+]+$/.test(this.NameEn) ||
              /^[a-zA-Z0-9$@$!%*?&#^-_. +]+$/.test(this.NameEn)
            ) {
            } else {
              throw new Error("Name English Validation Failed");
            }
          },
        },
      },
      shortCode: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        unique: true,
        allowNull: false,
        validate: {
          notNull: { msg: "Nationality Category will have shortCode" },
          notEmpty: { msg: "shortCode  will not be empty" },
        },
      },
      NameAr: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          ArabicLanguageVerification() {
            if (this.NameAr.trim() == "") {
              throw new Error("Please Enter  Name in  Arabic ");
            }
            if (
              /^[\u0621-\u064A\u0660-\u06690-9 ]+$/.test(this.NameAr) ||
              /^[\u0621-\u064A\u0660-\u06690-9]+$/.test(this.NameAr)
            ) {
            } else {
              throw new Error("Name Arabic Validation Failed");
            }
          },
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
              /^[a-zA-Z0-9$@$!%*?&#^-_.+]+$/.test(this.AbbrevEn) ||
              /^[a-zA-Z0-9$@$!%*?&#^-_. +]+$/.test(this.AbbrevEn)
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
              /^[\u0621-\u064A\u0660-\u06690-9 ]+$/.test(this.AbbrevAr) ||
              /^[\u0621-\u064A\u0660-\u06690-9]+$/.test(this.AbbrevAr)
            ) {
            } else {
              throw new Error("Abbreviation Arabic Validation Failed");
            }
          },
        },
      },
      AltNameEn: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          EnglishLanguageVerification() {
            if (this.AltNameEn.trim() == "") {
              throw new Error("Please Enter Alternate Name in English");
            }
            if (
              /^[a-zA-Z0-9$@$!%*?&#^-_.+]+$/.test(this.AltNameEn) ||
              /^[a-zA-Z0-9$@$!%*?&#^-_. +]+$/.test(this.AltNameEn)
            ) {
            } else {
              throw new Error("Alternate Name English Validation Failed");
            }
          },
        },
      },
      AltNameAr: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          ArabicLanguageVerification() {
            if (this.AltNameAr.trim() == "") {
              throw new Error("Please Enter  Alternate Name in  Arabic ");
            }
            if (
              /^[\u0621-\u064A\u0660-\u06690-9 ]+$/.test(this.AltNameAr) ||
              /^[\u0621-\u064A\u0660-\u06690-9]+$/.test(this.AltNameAr)
            ) {
            } else {
              throw new Error("Alternate Name Arabic Validation Failed");
            }
          },
        },
      },
      LabelEn: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          EnglishLanguageVerification() {
            if (this.LabelEn.trim() == "") {
              throw new Error("Please Enter Description in English");
            }
            if (
              /^[a-zA-Z0-9$@$!%*?&#^-_.+]+$/.test(this.LabelEn) ||
              /^[a-zA-Z0-9$@$!%*?&#^-_. +]+$/.test(this.LabelEn)
            ) {
            } else {
              throw new Error("Description English Validation Failed");
            }
          },
        },
      },

      LabelAr: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          ArabicLanguageVerification() {
            if (this.LabelAr.trim() == "") {
              throw new Error("Please Enter  Label Name in  Arabic ");
            }
            if (
              /^[\u0621-\u064A\u0660-\u06690-9 ]+$/.test(this.LabelAr) ||
              /^[\u0621-\u064A\u0660-\u06690-9]+$/.test(this.LabelAr)
            ) {
            } else {
              throw new Error("Label Name Arabic Validation Failed");
            }
          },
        },
      },

      Offset: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      ValueEn: {
        type: DataTypes.STRING,
        allowNull: false,
        EnglishLanguageVerification() {
          if (this.ValueEn.trim() == "") {
            throw new Error("Please Enter Value in English");
          }
          if (
            /^[a-zA-Z0-9$@$!%*?&#^-_.+]+$/.test(this.ValueEn) ||
            /^[a-zA-Z0-9$@$!%*?&#^-_. +]+$/.test(this.ValueEn)
          ) {
          } else {
            throw new Error("Value English Validation Failed");
          }
        },
      },
      ValueAr: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          ArabicLanguageVerification() {
            if (this.ValueAr.trim() == "") {
              throw new Error("Please Enter  Value in  Arabic ");
            }
            if (
              /^[\u0621-\u064A\u0660-\u06690-9 ]+$/.test(this.ValueAr) ||
              /^[\u0621-\u064A\u0660-\u06690-9]+$/.test(this.ValueAr)
            ) {
            } else {
              throw new Error("Alternate Value  Validation Failed");
            }
          },
        },
      },
      image: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Please Add Image Of Nationality" },
          notEmpty: {
            msg: "Without Image Nationality Will not get submitted",
          },
        },
      },
    },
    {
      freezeTableName: true,
      paranoid: true,
      initialAutoIncrement: 1000,
    }
  );
  return NationalityModel;
};
