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
        validate: {
          notNull: { msg: "Please Add Image Of Breeder" },
          notEmpty: {
            msg: "Without Image Breeder Will not get submitted",
          },
        },
      },
      MeetingType: {
        type: DataTypes.UUID,
        allowNull: false,
        validate: {
          notNull: { msg: "Please Add MeetingType Of Race" },
          notEmpty: {
            msg: "Without MeetingType Race Will not get submitted",
          },
        },
      },
      MeetingCode: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Please Add MeetingCode Of Race" },
          notEmpty: {
            msg: "Without MeetingCode Race Will not get submitted",
          },
        },
      },
      RaceName: {
        type: DataTypes.UUID,
        allowNull: false,
        validate: {
          notNull: { msg: "Race will have Race Name" },
          notEmpty: { msg: "Race Name  will not be empty" },
        },
      },

      RaceKind: {
        type: DataTypes.UUID,
        allowNull: false,
        validate: {
          notNull: { msg: "Race will have RaceKind" },
          notEmpty: { msg: "RaceKind  will not be empty" },
        },
      },
      TrackLength: {
        type: DataTypes.UUID,
        allowNull: false,
        validate: {
          notNull: { msg: "Please Add TrackLength Of Race" },
          notEmpty: {
            msg: "Without TrackLength Race Will not get submitted",
          },
        },
      },
      Ground: {
        type: DataTypes.UUID,
        allowNull: false,
        validate: {
          notNull: { msg: "Please Add GroundType Of Race" },
          notEmpty: {
            msg: "Without GroundType Race Will not get submitted",
          },
        },
      },
      DescriptionAr: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          ArabicLanguageVerification() {
            if (this.DescriptionAr.trim() == "") {
              throw new Error("Please Enter  Description in  Arabic ");
            }
            if (
              /^[\u0621-\u064A\u0660-\u06690-9a-zA-Z0-9$-@$!%*?&#^-_.+ ]+$/.test(this.DescriptionAr) ||
              /^[\u0621-\u064A\u0660-\u06690-9a-zA-Z0-9$-@$!%*?&#^-_.+]+$/.test(this.DescriptionAr)
            ) {
            } else {
              throw new Error("Description Arabic Validation Failed");
            }
          },
        },
      },
      DescriptionEn: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          EnglishLanguageVerification() {
            if (this.DescriptionEn.trim() == "") {
              throw new Error("Please Enter Description in English ");
            }
            if (
              /^[a-zA-Z0-9$-@!%*?&#^_.+]+$/.test(this.DescriptionEn) ||
              /^[a-zA-Z0-9$-@!%*?&#^_. +]+$/.test(this.DescriptionEn)
            ) {
            } else {
              throw new Error("Description English Validation Failed");
            }
          },
        },
      },
      RaceStatus: {
        type: DataTypes.STRING,
        allowNull: false,
        isIn: [["Completed", "Cancelled", "Live", "Due"]],
        defaultValue: "Due",
      },
      ResultStatus: {
        type: DataTypes.STRING,
        allowNull: false,
        isIn: [["Announced", "Awaited", "Cancelled"]],
        defaultValue: "Awaited",
      },
      DayNTime: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          notNull: { msg: "Please Add DayNTime Of Race" },
          notEmpty: {
            msg: "Without DayNTime Race Will not get submitted",
          },
        },
      },
      RaceCourse: {
        type: DataTypes.UUID,
        allowNull: false,
        validate: {
          notNull: { msg: "Please Add RaceCourse Of Race" },
          notEmpty: {
            msg: "Without RaceCourse Race Will not get submitted",
          },
        },
      },
      RaceType: {
        type: DataTypes.UUID,
        allowNull: false,
        validate: {
          notNull: { msg: "Race will have RaceType" },
          notEmpty: { msg: "RaceType  will not be empty" },
        },
      },
      HorseFilled: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      WeatherType: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Race will have WeatherType" },
          notEmpty: { msg: "WeatherType  will not be empty" },
        },
      },
      WeatherDegree: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Race will have WeatherDegree" },
          notEmpty: { msg: "WeatherDegree  will not be empty" },
        },
      },
      WeatherIcon: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Race will have WeatherIcon" },
          notEmpty: { msg: "WeatherIcon  will not be empty" },
        },
      },
      RaceType: {
        type: DataTypes.UUID,
        allowNull: false,
        validate: {
          notNull: { msg: "Race will have RaceType" },
          notEmpty: { msg: "RaceType  will not be empty" },
        },
      },
      FirstPrice: {
        type: DataTypes.BIGINT,
        defaultValue: 0,
      },
      SecondPrice: {
        type: DataTypes.BIGINT,
        defaultValue: 0,
      },
      ThirdPrice: {
        type: DataTypes.BIGINT,
        defaultValue: 0,
      },
      FourthPrice: {
        type: DataTypes.BIGINT,
        defaultValue: 0,
      },
      FifthPrice: {
        type: DataTypes.BIGINT,
        defaultValue: 0,
      },
      SixthPrice: {
        type: DataTypes.BIGINT,
        defaultValue: 0,
      },
      RaceCard: {
        type: DataTypes.UUID,
      },
      Competition: {
        type: DataTypes.UUID,
      },
      Sponsor: {
        type: DataTypes.UUID,
        allowNull: false,
        validate: {
          notNull: { msg: "Race will have Sponsor" },
          notEmpty: { msg: "Sponsor  will not be empty" },
        },
      },
    },
    {
      freezeTableName: true,
      paranoid: true,
      initialAutoIncrement: 10,
    }
  );
  return RaceModel;
};
