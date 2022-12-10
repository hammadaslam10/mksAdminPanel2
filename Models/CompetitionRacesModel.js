const Sequelize = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  const CompetitionRacesModel = sequelize.define(
    "CompetitionRacesModel",

    {
      _id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      CompetitionId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      RaceId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      CompetitionDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      NameEn: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          is: /^[a-z][a-z0-9]*[a-z0-9\s]*[a-z\s]*$/i,
          is: {
            msg: "Title English Must Be In English",
          },
          notNull: { msg: "Competition Category will have Name" },
          notEmpty: { msg: "Descritpion  will not be empty" },
        },
      },
      shortCode: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        unique: true,
        allowNull: false,
        validate: {
          notNull: { msg: "Competition Category will have Name" },
          notEmpty: { msg: "Descritpion  will not be empty" },
        },
      },
      NameAr: {
        type: DataTypes.STRING,
        validate: {
          is: /^[\u0621-\u064A\u0660-\u0669\d\s]+$/m,
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
  return CompetitionRacesModel;
};
