const Sequelize = require("sequelize");
const validator = require("validator");

module.exports = (sequelize, DataTypes) => {
  const ImagesStorageModel = sequelize.define(
    "ImagesStorageModel",

    {
      _id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true
      },
      image: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Please Add Image Of Advertisment" },
          notEmpty: {
            msg: "Without Image Advertisment Will not get submitted"
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
      }
    },
    {
      freezeTableName: true,
      paranoid: true,
      initialAutoIncrement: 10
    }
  );
  return ImagesStorageModel;
};
