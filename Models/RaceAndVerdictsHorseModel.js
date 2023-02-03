const Sequelize = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  const RaceAndVerdictsHorseModel = sequelize.define(
    "RaceAndVerdictsHorseModel",

    {
      VerdictName: {
        type: DataTypes.UUID,
        allowNull: false,
        validate: {
          notNull: { msg: "Please Add Name Of Verdict" },
          notEmpty: {
            msg: "Without Name Verdict Will not get submitted"
          }
        }
      },
      RaceToBePredict: {
        type: DataTypes.UUID,
        allowNull: false,
        validate: {
          notNull: { msg: "Please Add Name Of Race" },
          notEmpty: {
            msg: "Without Name Race Will not get submitted"
          }
        }
      },
      HorseNo1: {
        type: DataTypes.UUID,
        allowNull: false,
        validate: {
          notNull: { msg: "Please Add Name Of Horse 1" },
          notEmpty: {
            msg: "Without Name Horse 1 Will not get submitted"
          }
        }
      },
      HorseNo2: {
        type: DataTypes.UUID,
        allowNull: false,
        validate: {
          notNull: { msg: "Please Add Name Of Horse 2" },
          notEmpty: {
            msg: "Without Name Horse 2 Will not get submitted"
          }
        }
      },
      HorseNo3: {
        type: DataTypes.UUID,
        allowNull: false,
        validate: {
          notNull: { msg: "Please Add Name Of Horse 3" },
          notEmpty: {
            msg: "Without Name Horse 3 Will not get submitted"
          }
        }
      },
      Remarks: {
        type: DataTypes.TEXT("long"),
        allowNull: false,
        validate: {
          notNull: { msg: "Please Add Name Of Remarks" },
          notEmpty: {
            msg: "Without Name Remarks Will not get submitted"
          }
        }
      }
    },
    {
      freezeTableName: true,
      paranoid: true,
      initialAutoIncrement: 10
    }
  );
  return RaceAndVerdictsHorseModel;
};
