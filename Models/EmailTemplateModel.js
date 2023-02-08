const Sequelize = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  const EmailTemplateModel = sequelize.define(
    "EmailTemplateModel",

    {
      _id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      TemplateName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "EmailTemplate will have TemplateName" },
          notEmpty: { msg: "TemplateName  will not be empty" },
        },
      },
      Subject: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "EmailTemplate will have Subject" },
          notEmpty: { msg: "Subject  will not be empty" },
        },
      },
      Html: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "EmailTemplate will have Html" },
          notEmpty: { msg: "Html  will not be empty" },
        },
      },
      Target: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "EmailTemplate will have Target" },
          notEmpty: { msg: "Target  will not be empty" },
        },
      },
      Status: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      freezeTableName: true,
      paranoid: true,
      initialAutoIncrement: 10,
    }
  );
  return EmailTemplateModel;
};
