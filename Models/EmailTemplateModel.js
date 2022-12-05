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
          notNull: { msg: "EmailTemplate will have ShortCode" },
          notEmpty: { msg: "Subject  will not be empty" },
        },
      },
    },
    {
      freezeTableName: true,
      paranoid: true,
      initialAutoIncrement: 1000,
    }
  );
  return EmailTemplateModel;
};
