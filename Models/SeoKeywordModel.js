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
          notNull: { msg: "Ad will have Keyword" },
          notEmpty: { msg: "Descritpion  will not be empty" },
        },
      },
      KeywordAr: {
        type: DataTypes.STRING,
        validate: {
          is: /^[\u0621-\u064A\u0660-\u0669]*$/gm,
          is: {
            msg: "Keyword Must Be In Arabic",
          },
        },
      },
      TitleEn: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
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
    }
  );
  return SeokeywordModel;
};
