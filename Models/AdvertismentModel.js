const Sequelize = require("sequelize");
const validator = require("validator");

module.exports = (sequelize, DataTypes) => {
  const AdvertismentModel = sequelize.define(
    "AdvertismentModel",

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
          notNull: { msg: "Please Add Image Of Advertisment" },
          notEmpty: {
            msg: "Without Image Advertisment Will not be get submit",
          },
        },
      },
      DescriptionEn: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          EnglishLanguageVerification() {
            if (this.DescriptionEn.trim() == "") {
              throw new Error("Description English is Empty");
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
        allowNull: false,
        validate: {
          ArabicLanguageVerification() {
            if (this.DescriptionAr.trim() == "") {
              throw new Error("Description Arabic is Empty");
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
              throw new Error("Description English is Empty");
            }
            if (
              /^[a-zA-Z0-9$@$!%*?&#^-_.+]+$/.test(this.TitleEn) ||
              /^[a-zA-Z0-9$@$!%*?&#^-_. +]/.test(this.TitleEn)
            ) {
            } else {
              throw new Error("Description English Validation Failed");
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
              throw new Error("Title Arabic is Empty");
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
      initialAutoIncrement: 1000,
    }
  );
  return AdvertismentModel;
};
