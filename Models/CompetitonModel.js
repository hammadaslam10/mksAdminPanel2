const Sequelize = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  const CompetitonModel = sequelize.define(
    "CompetitonModel",

    {
      _id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      CompetitionCategory: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      CompetitionCode: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Competition will have CompetitionCode" },
          notEmpty: { msg: "CompetitionCode  will not be empty" },
        },
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
      NameAr: {
        type: DataTypes.STRING,
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
      DescEn: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          EnglishLanguageVerification() {
            if (this.DescEn.trim() == "") {
              throw new Error("Please Enter Description in English ");
            }
            if (
              /^[a-zA-Z0-9$@$!%*?&#^-_.+]+$/.test(this.DescEn) ||
              /^[a-zA-Z0-9$@$!%*?&#^-_. +]+$/.test(this.DescEn)
            ) {
            } else {
              throw new Error("Description English Validation Failed");
            }
          },
        },
      },
      DescAr: {
        type: DataTypes.STRING,
        validate: {
          ArabicLanguageVerification() {
            if (this.DescAr.trim() == "") {
              throw new Error("Please Enter  Description in  Arabic ");
            }
            if (
              /^[\u0621-\u064A\u0660-\u06690-9 ]+$/.test(this.DescAr) ||
              /^[\u0621-\u064A\u0660-\u06690-9]+$/.test(this.DescAr)
            ) {
            } else {
              throw new Error("Description Arabic Validation Failed");
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
          notNull: { msg: "Competition will have shortCode" },
          notEmpty: { msg: "shortCode  will not be empty" },
        },
      },

      pickCount: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      TriCount: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      StartDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      freezeTableName: true,
      paranoid: true,
      initialAutoIncrement: 1000,
    }
  );
  return CompetitonModel;
};
