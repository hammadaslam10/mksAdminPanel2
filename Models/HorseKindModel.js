const Sequelize = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  const HorseKindModel = sequelize.define(
    "HorseKindModel",

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
          notNull: { msg: "Horse Kind will have Name" },
          notEmpty: { msg: "Descritpion  will not be empty" },
        },
      },
      shortName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Horse Kind will have ShortName" },
          notEmpty: { msg: "Descritpion  will not be empty" },
        },
      },
      NameAr: {
        type: DataTypes.STRING,
        validate: {
          is: /[\u0600-\u06FF]/gm,
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
  return HorseKindModel;
};
