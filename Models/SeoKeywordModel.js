const Sequelize = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  const SeokeywordModel = sequelize.define(
    "SeokeywordModel",

    {
      _id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },

      KeywordEn: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          EnglishLanguageVerification() {
            if (this.KeywordEn.trim() == "") {
              throw new Error("Please Enter Keyword in English ");
            }
            if (
              /^[a-zA-Z0-9$@$!%*?&#^-_.+]+$/.test(this.KeywordEn) ||
              /^[a-zA-Z0-9$@$!%*?&#^-_. +]+$/.test(this.KeywordEn)
            ) {
            } else {
              throw new Error("Kyword English Validation Failed");
            }
          },
        },
      },
      KeywordAr: {
        type: DataTypes.STRING,
        validate: {
          ArabicLanguageVerification() {
            if (this.KeywordAr.trim() == "") {
              throw new Error("Please Enter  Keyword in  Arabic ");
            }
            if (
              /^[\u0621-\u064A\u0660-\u06690-9 ]+$/.test(this.KeywordAr) ||
              /^[\u0621-\u064A\u0660-\u06690-9]+$/.test(this.KeywordAr)
            ) {
            } else {
              throw new Error("Keyword Arabic Validation Failed");
            }
          },
        },
      },
      TitleEn: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          EnglishLanguageVerification() {
            if (this.TitleEn.trim() == "") {
              throw new Error("Please Enter Title in English ");
            }
            if (
              /^[a-zA-Z0-9$@$!%*?&#^-_.+]+$/.test(this.TitleEn) ||
              /^[a-zA-Z0-9$@$!%*?&#^-_. +]+$/.test(this.TitleEn)
            ) {
            } else {
              throw new Error("Title English Validation Failed");
            }
          },
        },
      },
      TitleAr: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          ArabicLanguageVerification() {
            if (this.TitleAr.trim() == "") {
              throw new Error("Please Enter Title in  Arabic ");
            }
            if (
              /^[\u0621-\u064A\u0660-\u06690-9 ]+$/.test(this.TitleAr) ||
              /^[\u0621-\u064A\u0660-\u06690-9]+$/.test(this.TitleAr)
            ) {
            } else {
              throw new Error("Title Arabic Validation Failed");
            }
          },
        },
      },
    },
    {
      freezeTableName: true,
      paranoid: true,
    }
  );
  return SeokeywordModel;
};
