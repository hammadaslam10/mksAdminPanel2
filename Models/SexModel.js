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
          notNull: { msg: "Sex will have Name" },
          notEmpty: { msg: "Name  will not be empty" },
        },
      },
      shortCode: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Sex will have ShortCode" },
          notEmpty: { msg: "Name  will not be empty" },
        },
      },
      NameAr: {
        type: DataTypes.STRING,
        validate: {
          is: /[\u0600-\u06FF]/,
          is: {
            msg: "Name Must Be In Arabic",
          },
        },
      },
    },
    {
      freezeTableName: true,
      paranoid: true,
    }
  );
  return SexModel;
};
