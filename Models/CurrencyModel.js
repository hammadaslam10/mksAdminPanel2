const Sequelize = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  const CurrencyModel = sequelize.define(
    "CurrencyModel",

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
          is: /^[A-Za-z\s]*$/,
          is: {
            msg: "Title English Must Be In English",
          },
          notNull: { msg: "Currency will have Name" },
          notEmpty: { msg: "Name  will not be empty" },
        },
      },
      shortCode: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        unique: true,
        allowNull: false,
        validate: {
          notNull: { msg: "Currency will have ShortCode" },
          notEmpty: { msg: "shortCode  will not be empty" },
        },
      },
      NameAr: {
        type: DataTypes.STRING,
        validate: {
          is: /^[\u0621-\u064A\u0660-\u0669 ]+$/,
          is: {
            msg: "Name Must Be In Arabic",
          },
        },
      },
      Rate: {
        type: DataTypes.BIGINT,
        allowNull: false,
        validate: {
          notNull: { msg: "Currency will have Rate" },
          notEmpty: { msg: "Rate  will not be empty" },
        },
      },
    },

    {
      freezeTableName: true,
      paranoid: true,
      initialAutoIncrement: 1000,
    }
  );
  return CurrencyModel;
};
