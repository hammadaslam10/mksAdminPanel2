const { Sequelize } = require("sequelize");
const Db = require("../config/Connection");
const HorseModel = require("./HorseModel");
const { DataTypes } = Sequelize;

const RaceCourseModel = require("./RaceCourseModel");

const RaceModel = Db.define(
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
    Weather: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: "Race will have Weather" },
        notEmpty: { msg: "Weather  will not be empty" },
      },
    },
    RaceStatus: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    DayNTime: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    RaceCourse: {
      type: DataTypes.UUID,
      references: {
        model: "RaceCourseModel",
        key: "_id",
      },
    },
    Horses: {
      type: DataTypes.UUID,
      references: {
        model: "HorseModel",
        key: "_id",
      },
    },
    IsActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    freezeTableName: true,
    paranoid: true,
  }
);
RaceModel.belongsToMany(HorseModel, {
  through: "Horses",
});
RaceModel.belongsTo(RaceCourseModel, {
  through: "RaceCourse",
});
RaceModel.sync();

module.exports = RaceModel;
