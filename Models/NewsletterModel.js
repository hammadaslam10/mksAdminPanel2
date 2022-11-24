const Sequelize = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  const NewsletterModel = sequelize.define(
    "NewsletterModel",

    {
      _id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      Email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "EmailTemplate will have TemplateName" },
          notEmpty: { msg: "TemplateName  will not be empty" },
        },
      },
    },
    {
      freezeTableName: true,
      paranoid: true,
    }
  );
  return NewsletterModel;
};