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
      // HorseId: {
      //   type: DataTypes.UUID,
      //   allowNull: true,
      //   references: {
      //     model: "HorseModel",
      //     key: "_id",
      //   },
      // },
      // RaceId: {
      //   type: DataTypes.UUID,
      //   allowNull: true,
      //   references: {
      //     model: "RaceModel",
      //     key: "_id",
      //   },
      // },
    },
    {
      freezeTableName: true,
      paranoid: true,
    }
  );
  return RaceModel;
};
