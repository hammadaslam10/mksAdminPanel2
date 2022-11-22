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
      TrackNameEn: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "RaceCourse will have TrackName" },
          notEmpty: { msg: "TrackName  will not be empty" },
        },
      },
      TrackNameAr: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          is: /^[\u0621-\u064A0-9 ]+$/,
          is: {
            msg: "RaceName Must Be In Arabic",
          },
        },
      },

      // GroundTypeEn: {
      //   type: DataTypes.STRING,
      //   allowNull: false,
      //   validate: {
      //     notNull: { msg: "RaceCourse will have GroundType" },
      //     notEmpty: { msg: "GroundType  will not be empty" },
      //   },
      // },
      // GroundTypeAr: {
      //   type: DataTypes.STRING,
      //   allowNull: false,
      //   validate: {
      //     is: /^[\u0621-\u064A0-9 ]+$/,
      //     is: {
      //       msg: "RaceName Must Be In Arabic",
      //     },
      //   },
      // },
      GroundType: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: "GroundTypeModel",
          key: "_id",
        },
      },
      NationalityId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "NationalityModel",
          key: "_id",
        },
      },
      ColorCode: {
        type: DataTypes.UUID,
        allowNull: false,
        validate: {
          notNull: { msg: "RaceCourse will have ColorCode" },
          notEmpty: { msg: "ColorCode  will not be empty" },
        },
      },
      shortCode: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "RaceCourse will have shortCode" },
          notEmpty: { msg: "shortCode  will not be empty" },
        },
      },
    },
    {
      freezeTableName: true,
      paranoid: true,
    }
  );
  return RaceCourseModel;
};
