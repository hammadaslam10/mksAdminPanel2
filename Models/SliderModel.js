const { Sequelize } = require("sequelize");
const Db = require("../config/Connection");
const { DataTypes } = Sequelize;

const SliderModel = Db.define(
  "SliderModel",

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
SliderModel.sync();

module.exports = SliderModel;
