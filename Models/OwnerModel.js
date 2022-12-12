const Sequelize = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  const OwnerModel = sequelize.define(
    "OwnerModel",

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
      NameEn: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          is: /^[A-Za-z\s]*$/,
          is: {
            msg: "Owner Name Must Be In English",
          },
          notNull: { msg: "Ad will have Title" },
          notEmpty: { msg: "Title   will not be empty" },
        },
      },
      NationalityID: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      NameAr: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          is: /^[\u0621-\u064A\u0660-\u0669 ]+$/,
          is: {
            msg: "Owner Name Must Be In Arabic",
          },
          notNull: { msg: "Ad will have Title" },
          notEmpty: { msg: "Title   will not be empty" },
        },
      },
      TitleEn: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          is: /^[A-Za-z\s]*$/,
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
          is: /^[\u0621-\u064A\u0660-\u0669 ]+$/,
          is: {
            msg: "Title English Must Be In Arabic",
          },
          notNull: { msg: "Ad will have Title" },
          notEmpty: { msg: "Title   will not be empty" },
        },
      },
      ShortEn: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          is: /^[A-Za-z\s]*$/,
          is: {
            msg: "Title English Must Be In English",
          },
          notNull: { msg: "Ad will have Title" },
          notEmpty: { msg: "Title   will not be empty" },
        },
      },
      ShortAr: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          is: /^[\u0621-\u064A\u0660-\u0669 ]+$/,
          is: {
            msg: "Title English Must Be In English",
          },
          notNull: { msg: "Ad will have Title" },
          notEmpty: { msg: "Title   will not be empty" },
        },
      },
      RegistrationDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      freezeTableName: true,
      paranoid: true,
      initialAutoIncrement: 1000,
    }
  );
  return OwnerModel;
};
