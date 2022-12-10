const Sequelize = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  const NationalityModel = sequelize.define(
    "NationalityModel",

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
          is: /^[a-z0-9_.-\s]+$/i,
          is: {
            msg: "Please enter the Nationality Name in English",
          },
          notNull: { msg: "Nationality Category will have NameEn" },
          notEmpty: { msg: "NameEn  will not be empty" },
        },
      },
      shortCode: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        unique: true,
        allowNull: false,
      },
      NameAr: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          is: /^[\u0621-\u064A\u0660-\u0669\d\s]+$/m,
          is: {
            msg: "Please enter the Nationality Name in Arabic",
          },
          validate: {
            notNull: { msg: "Nationality  will have Name" },
            notEmpty: { msg: "Name  will not be empty" },
          },
        },
      },
      Abbrev: {
        type: DataTypes.STRING,
        allowNull: false,
        is: /^[a-z0-9_.-\s]+$/i,
        is: {
          msg: " Please enter the Abbreviation in in English",
        },
        validate: {
          notNull: { msg: "Nationality Abbreviation will have Abbrev" },
          notEmpty: { msg: "Abbrev  will not be empty" },
        },
      },
      AltName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Nationality Category will have AltName" },
          notEmpty: { msg: "AltName  will not be empty" },
        },
      },
      Label: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Nationality Category will have Label" },
          notEmpty: { msg: "Label  will not be empty" },
        },
      },

      Offset: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      Value: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      image: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      freezeTableName: true,
      paranoid: true,
      initialAutoIncrement: 1000,
    }
  );
  return NationalityModel;
};
