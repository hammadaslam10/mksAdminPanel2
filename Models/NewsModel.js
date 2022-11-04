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
          notNull: { msg: "News will have Image" },
          notEmpty: { msg: "Image   will not be empty" },
        },
      },
      DescriptionEn: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "News will have DescriptionEn" },
          notEmpty: { msg: "DescriptionEn   will not be empty" },
        },
      },
      DescriptionAr: {
        type: DataTypes.STRING,
        validate: {
          is: /[\u0600-\u06FF]/,
          is: {
            msg: "Description Must Be In Arabic",
          },
        },
      },
      TitleEn: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "News will have TitleEn" },
          notEmpty: { msg: "TitleEn   will not be empty" },
        },
      },
      TitleAr: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          is: /[\u0600-\u06FF]/,
          is: {
            msg: "Title Must Be In Arabic",
          },
        },
      },
      SecondTitleEn: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "News will have Name" },
          notEmpty: { msg: "Name   will not be empty" },
        },
      },
      SecondTitleAr: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          is: /[\u0600-\u06FF]/,
          is: {
            msg: "Title Must Be In Arabic",
          },
        },
      },
    },
    {
      freezeTableName: true,
      paranoid: true,
    }
  );
  return NewsModel;
};
