const Sequelize = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  const CompetitonModel = sequelize.define(
    "CompetitonModel",

    {
      _id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      CompetitionCategory: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      // CompetitionStatus: {
      //   type: DataTypes.BOOLEAN,
      //   allowNull: false,
      //   defaultValue: 0,
      // },
      CompetitionCode: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Competition will have CompetitionCode" },
          notEmpty: { msg: "CompetitionCode  will not be empty" },
        },
      },
      NameEn: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Competition will have Name" },
          notEmpty: { msg: "Name  will not be empty" },
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
      DescEn: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Competition will have Desc" },
          notEmpty: { msg: "Descritpion  will not be empty" },
        },
      },
      DescAr: {
        type: DataTypes.STRING,
        validate: {
          is: /^[\u0621-\u064A\u0660-\u0669 ]+$/gm,
          is: {
            msg: "Desc Must Be In Arabic",
          },
        },
      },
      shortCode: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        unique: true,
        allowNull: false,
        validate: {
          notNull: { msg: "Competition will have shortCode" },
          notEmpty: { msg: "shortCode  will not be empty" },
        },
      },

      pickCount: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      TriCount: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      StartDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      freezeTableName: true,
      paranoid: true,
      initialAutoIncrement: 1000,
    }
  );
  return CompetitonModel;
};
