const Sequelize = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  const SexModel = sequelize.define(
    "SexModel",

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
            msg: " Please enter the Gender Name in English",
          },
          notNull: { msg: "Sex will have Name" },
          notEmpty: { msg: "Name  will not be empty" },
        },
      },
      shortCode: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        unique: true,
        allowNull: false,
        validate: {
          notNull: { msg: "Sex will have ShortCode" },
          notEmpty: { msg: "Name  will not be empty" },
        },
      },
      NameAr: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          is: /^[\u0621-\u064A\u0660-\u0669\d\s]+$/m,
          is: {
            msg: "Please enter the Gender Name in  Arabic",
          },
          notNull: { msg: "Sex will have ShortCode" },
          notEmpty: { msg: "Name  will not be empty" },
        },
      },
    },
    {
      freezeTableName: true,
      paranoid: true,
      initialAutoIncrement: 1000,
    }
  );
  return SexModel;
};
