const Sequelize = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  const RaceKindModel = sequelize.define(
    "RaceKindModel",

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
      shortCode: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        unique: true,
        allowNull: false,
        validate: {
          notNull: { msg: "Race will have ShortCode" },
          notEmpty: { msg: "Descritpion  will not be empty" },
        },
      },
      NameAr: {
        type: DataTypes.STRING,
        validate: {
          ArabicLanguageVerification() {
            if (this.NameAr.trim() == "") {
              throw new Error("Please Enter  Name in  Arabic ");
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
              throw new Error("Name Arabic Validation Failed");
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
  return RaceKindModel;
};
