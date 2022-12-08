const Sequelize = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  const ColorModel = sequelize.define(
    "ColorModel",

    {
      _id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },

      NameEn: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Color will have Name" },
          notEmpty: { msg: "Descritpion  will not be empty" },
        },
      },
      shortCode: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        unique: true,
        allowNull: false,
        validate: {
          notNull: { msg: "Color will have ShortCode" },
          notEmpty: { msg: "ShortCode  will not be empty" },
          // unique: { msg: "Already Existed" },
        },
      },
      NameAr: {
        type: DataTypes.STRING,
        validate: {
          is: /[\u0600-\u06FF]/gm,
          is: {
            msg: "Name Must Be In Arabic",
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
  return ColorModel;
};
