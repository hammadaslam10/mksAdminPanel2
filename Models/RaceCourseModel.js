const { Sequelize } = require("sequelize");
const Db = require("../config/Connection");
const { DataTypes } = Sequelize;

const RaceCourseModel = Db.define(
  "RaceCourseModel",

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
    Country: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    TrackName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    TrackLength: {
      type: DataTypes.INTEGER,
      //     validate: {
      //  // is: /^[0-9]+$/,
      //       is: {
      //         msg: "Track Length should be in number",
      //       },
      //     },
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
RaceCourseModel.sync();

module.exports = RaceCourseModel;
