const Sequelize = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  const SponsorModel = sequelize.define(
    "SponsorModel",

    {
      _id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true
      },
      image: {
        type: DataTypes.STRING
      },
      DescriptionEn: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          EnglishLanguageVerification() {
            if (this.DescriptionEn.trim() == "") {
              throw new Error("Please Enter Description in English ");
            }
            if (
              /^[a-zA-Z0-9$-@!%*?&#^_.+]+$/.test(this.DescriptionEn) ||
              /^[a-zA-Z0-9$-@!%*?&#^_. +]+$/.test(this.DescriptionEn)
            ) {
            } else {
              throw new Error("Description English Validation Failed");
            }
          }
        }
      },
      DescriptionAr: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          ArabicLanguageVerification() {
            if (this.DescriptionAr.trim() == "") {
              throw new Error("Please Enter  Description in  Arabic ");
            }
            if (
              /^[a-zA-Z0-9$-@$!%*?&#^-_,،.+\u0621-\u064A\u0660-\u0669 ]+$/.test(
                this.DescriptionAr
              ) ||
              /^[\u0621-\u064A\u0660-\u06690-9a-zA-Z0-9$-@$!%*?&#^-_.+]+$/.test(
                this.DescriptionAr
              )
            ) {
            } else {
              throw new Error("Description Arabic Validation Failed");
            }
          }
        }
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
              /^[a-zA-Z0-9$-@!%*?&#^_.+]+$/.test(this.TitleEn) ||
              /^[a-zA-Z0-9$-@!%*?&#^_. +]+$/.test(this.TitleEn)
            ) {
            } else {
              throw new Error("Title English Validation Failed");
            }
          }
        }
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
              /^[a-zA-Z0-9$-@$!%*?&#^-_,،.+\u0621-\u064A\u0660-\u0669 ]+$/.test(
                this.TitleAr
              ) ||
              /^[\u0621-\u064A\u0660-\u06690-9a-zA-Z0-9$-@$!%*?&#^-_.+]+$/.test(
                this.TitleAr
              )
            ) {
            } else {
              throw new Error("Title Arabic Validation Failed");
            }
          }
        }
      },
      Url: {
        type: DataTypes.STRING
      }
    },
    {
      freezeTableName: true,
      paranoid: true,
      initialAutoIncrement: 10
    }
  );
  return SponsorModel;
};
