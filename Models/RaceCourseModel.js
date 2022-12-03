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
          is: /(\w*[ء-ي]\w*)/gm,
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
      //     is: /(\w*[ء-ي]\w*)/gm,
      //     is: {
      //       msg: "RaceName Must Be In Arabic",
      //     },
      //   },
      // },

      NationalityID: {
        type: DataTypes.UUID,
        allowNull: false,
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
        type: DataTypes.BIGINT,
        autoIncrement: true,
        unique: true,
        allowNull: false,
        validate: {
          notNull: { msg: "RaceCourse will have shortCode" },
          notEmpty: { msg: "shortCode  will not be empty" },
        },
      },
    },
    {
      initialAutoIncrement: 1000,
    },
    {
      freezeTableName: true,
      paranoid: true,
    }
  );
  return RaceCourseModel;
};
