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
      },
      DescriptionEn: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          is: /[a-z0-9.\-\s]/gim,
          is: {
            msg: "Description English Must Be In English",
          },
          notNull: { msg: "Ad will have description" },
          notEmpty: { msg: "Descritpion  will not be empty" },
        },
      },
      DescriptionAr: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          is: /^[\u0621-\u064A\u0660-\u0669]*$/gm,
          is: {
            msg: "Description Must Be In Arabic",
          },
        },
      },
      TitleEn: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          is: /^[a-z0-9]+$/g,
          is: {
            msg: "Title English Must Be In English",
          },
          notNull: { msg: "Ad will have Title" },
          notEmpty: { msg: "Title   will not be empty" },
        },
      },
      TitleAr: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          is: /^[\u0621-\u064A\u0660-\u0669]*$/gm,
          is: {
            msg: "Title Must Be In Arabic",
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
