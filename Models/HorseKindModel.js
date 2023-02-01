const Sequelize = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  const HorseKindModel = sequelize.define(
    "HorseKindModel",

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
        unique: true,
        validate: {
          EnglishLanguageVerification() {
            if (this.NameEn.trim() == "") {
              throw new Error("Please Enter  Name in English is Empty");
            }
            if (
              /^[a-zA-Z0-9$-@!%*?&#^_.+]+$/.test(this.NameEn) ||
              /^[a-zA-Z0-9$-@!%*?&#^_. +]+$/.test(this.NameEn)
            ) {
            } else {
              throw new Error("Name in English Validation Failed");
            }
          },
        },
      },
      NameAr: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
          ArabicLanguageVerification() {
            if (this.NameAr.trim() == "") {
              throw new Error("Please Enter  Description in  Arabic ");
            }
            if (
              /^[a-zA-Z0-9$-@$!%*?&#^-_,،.+\u0621-\u064A\u0660-\u0669 ]+$/.test(
                this.NameAr
              ) ||
              /^[\u0621-\u064A\u0660-\u06690-9a-zA-Z0-9$-@$!%*?&#^-_.+]+$/.test(
                this.NameAr
              )
            ) {
            } else {
              throw new Error("Description Arabic Validation Failed");
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
      shortCode: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        unique: true,
        allowNull: false,
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
  return HorseKindModel;
};
