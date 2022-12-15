const Sequelize = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  const NewsModel = sequelize.define(
    "NewsModel",

    {
      _id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      image: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Please Add Image Of News" },
          notEmpty: {
            msg: "Without Image News Will not be get submit",
          },
        },
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
              /^[a-zA-Z0-9$@$!%*?&#^-_.+]+$/.test(this.DescriptionEn) ||
              /^[a-zA-Z0-9$@$!%*?&#^-_. +]/.test(this.DescriptionEn)
            ) {
            } else {
              throw new Error("Description English Validation Failed");
            }
          },
        },
      },
      DescriptionAr: {
        type: DataTypes.STRING,
        validate: {
          ArabicLanguageVerification() {
            if (this.DescriptionAr.trim() == "") {
              throw new Error("Please Enter  Description in  Arabic ");
            }
            if (
              /^[\u0621-\u064A\u0660-\u06690-9 ]+$/.test(this.DescriptionAr) ||
              /^[\u0621-\u064A\u0660-\u06690-9]+$/.test(this.DescriptionAr)
            ) {
            } else {
              throw new Error("Description Arabic Validation Failed");
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
              /^[a-zA-Z0-9$@$!%*?&#^-_. +]/.test(this.TitleEn)
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
              throw new Error("Please Enter  Title in  Arabic ");
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
      SecondTitleEn: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          EnglishLanguageVerification() {
            if (this.SecondTitleEn.trim() == "") {
              throw new Error("Please Enter Second Title in English ");
            }
            if (
              /^[a-zA-Z0-9$@$!%*?&#^-_.+]+$/.test(this.SecondTitleEn) ||
              /^[a-zA-Z0-9$@$!%*?&#^-_. +]/.test(this.SecondTitleEn)
            ) {
            } else {
              throw new Error("Second Title English Validation Failed");
            }
          },
        },
      },
      SecondTitleAr: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          ArabicLanguageVerification() {
            if (this.SecondTitleAr.trim() == "") {
              throw new Error("Please Enter  Second Title in  Arabic ");
            }
            if (
              /^[\u0621-\u064A\u0660-\u06690-9 ]+$/.test(this.SecondTitleAr) ||
              /^[\u0621-\u064A\u0660-\u06690-9]+$/.test(this.SecondTitleAr)
            ) {
            } else {
              throw new Error("Second Title Arabic Validation Failed");
            }
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
  return NewsModel;
};
