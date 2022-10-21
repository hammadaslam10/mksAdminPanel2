const { Sequelize } = require("sequelize");
const Db = require("../config/Connection");
const { DataTypes } = Sequelize;

const NewsModel = Db.define(
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
    },
    DescriptionEn: {
      type: DataTypes.STRING,
      allowNull: false,
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
    IsActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    freezeTableName: true,
    paranoid: true,
  }
);
NewsModel.sync();

module.exports = NewsModel;
