const Sequelize = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  const SponsorModel = sequelize.define(
    "SponsorModel",

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
          notNull: { msg: "Please Add Image Of Sponsor" },
          notEmpty: {
            msg: "Without Image Sponsor Will not be get submit",
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
        allowNull: false,
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
          notNull: { msg: "Ad will have description" },
          notEmpty: { msg: "Descritpion  will not be empty" },
        },
      },
      TitleAr: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          is: /^[\u0621-\u064A\u0660-\u0669 ]+$/,
          is: {
            msg: "Title Must Be In Arabic",
          },
        },
      },
      Url: {
        type: DataTypes.STRING,
      },
    },
    {
      freezeTableName: true,
      paranoid: true,
      initialAutoIncrement: 1000,
    }
  );
  return SponsorModel;
};
