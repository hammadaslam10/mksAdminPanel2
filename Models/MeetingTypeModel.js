const Sequelize = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  const MeetingTypeModel = sequelize.define(
    "MeetingTypeModel",

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
          is: /^[A-Za-z\s]*$/,
          is: {
            msg: "Title English Must Be In English",
          },
          notNull: { msg: "Horse Kind will have Name" },
          notEmpty: { msg: "Descritpion  will not be empty" },
        },
      },
      shortCode: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        unique: true,
        allowNull: false,
        validate: {
          notNull: { msg: "Horse Kind will have ShortCode" },
          notEmpty: { msg: "Descritpion  will not be empty" },
        },
      },
      NameAr: {
        type: DataTypes.STRING,
        validate: {
          is: /^[\u0621-\u064A\u0660-\u0669 ]+$/,
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
  return MeetingTypeModel;
};
