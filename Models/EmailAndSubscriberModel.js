const Sequelize = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  const EmailAndSubscriberModel = sequelize.define(
    "EmailAndSubscriberModel",

    {
      _id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      EmailText: {
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
          notEmpty: { msg: "Descritpion  will not be empty" },
        },
      },
      NameAr: {
        type: DataTypes.STRING,
        validate: {
          is: /^[\u0621-\u064A\u0660-\u0669 ]+$/gm,
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
  return EmailAndSubscriberModel;
};
