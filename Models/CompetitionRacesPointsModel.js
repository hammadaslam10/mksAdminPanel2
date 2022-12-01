const Sequelize = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  const CompetitionRacesPointsModel = sequelize.define(
    "CompetitionRacesPointsModel",

    {
      _id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true
      },

      Points: {
        type: DataTypes.DOUBLE,
        allowNull: false
      },
      BonusPoints: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        defaultValue: 0.0
      }
    },
    
    {
      freezeTableName: true,
      paranoid: true
    }
  );
  return CompetitionRacesPointsModel;
};
