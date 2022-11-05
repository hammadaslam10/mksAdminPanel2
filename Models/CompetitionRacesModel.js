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
          notNull: { msg: "Competition Category will have Name" },
          notEmpty: { msg: "Descritpion  will not be empty" },
        },
      },
      shortCode: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Competition Category will have Name" },
          notEmpty: { msg: "Descritpion  will not be empty" },
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
      Status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
    },
    {
      freezeTableName: true,
      paranoid: true,
    }
  );
  return CompetitionRacesModel;
};
