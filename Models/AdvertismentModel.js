const Sequelize = require("sequelize");
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
          is: /^[A-Za-z0-9 _]*$/,
          is: {
            msg: "Description English Must Be In English",
          },
          notNull: { msg: "Ad will have description" },
          notEmpty: { msg: "Descritpion  will not be empty" },
        },
      },
      DescriptionAr: {
        type: DataTypes.STRING,
        validate: {
          is: /(\w*[ء-ي]\w*)/gm,
          is: {
            msg: "Description Must Be In Arabic",
          },
        },
      },
      TitleEn: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          is: /^[A-Za-z0-9 _]*$/,
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
          is: /(\w*[ء-ي]\w*)/gm,
          is: {
            msg: "Title Must Be In Arabic",
          },
        },
      },
    },
    {
      initialAutoIncrement: 1000,
    },
    {
      freezeTableName: true,
      paranoid: true,
    }
  );
  return AdvertismentModel;
};
