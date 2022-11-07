const Sequelize = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  const RaceModel = sequelize.define(
    "RaceModel",

    {
      _id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      image: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      RaceKind: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Race will have RaceKind" },
          notEmpty: { msg: "RaceKind  will not be empty" },
        },
      },
      Description: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Race will have description" },
          notEmpty: { msg: "Descritpion  will not be empty" },
        },
      },
      RaceStatus: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      DayNTime: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      RaceCourse: {
        type: DataTypes.UUID,
        references: {
          model: "RaceCourseModel",
          key: "_id",
        },
      },
      RaceType: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Race will have RaceKind" },
          notEmpty: { msg: "RaceKind  will not be empty" },
        },
      },
      HorseFilled: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      ActiveJockeyForTheRace: {
        type: DataTypes.UUID,
        references: {
          model: "JockeyModel",
          key: "_id",
        },
      },
    },
    {
      freezeTableName: true,
      paranoid: true,
    }
  );
  return RaceModel;
};
