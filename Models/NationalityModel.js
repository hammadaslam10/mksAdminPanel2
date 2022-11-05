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
          notNull: { msg: "Competition Category will have Name" },
          notEmpty: { msg: "Descritpion  will not be empty" },
        },
      },
      shortCode: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Competition Category will have Name" },
          notEmpty: { msg: "Descritpion  will not be empty" },
        },
      },
      NameAr: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          is: /[\u0600-\u06FF]/,
          is: {
            msg: "Name Must Be In Arabic",
          },
        },
      },
      Abbrev: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Competition Category will have Name" },
          notEmpty: { msg: "Descritpion  will not be empty" },
        },
      },
      AltName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Competition Category will have Name" },
          notEmpty: { msg: "Descritpion  will not be empty" },
        },
      },
      Label: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Competition Category will have Name" },
          notEmpty: { msg: "Descritpion  will not be empty" },
        },
      },
      Status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      Offset: {
        type: DataTypes.INTEGER,
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
    }
  );
  return NationalityModel;
};
