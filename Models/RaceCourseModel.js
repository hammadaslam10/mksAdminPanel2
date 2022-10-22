const Sequelize = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  const RaceCourseModel = sequelize.define(
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
  return RaceCourseModel;
};
