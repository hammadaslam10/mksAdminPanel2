const Sequelize = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  const HorseAndRaceModel = sequelize.define(
    "HorseAndRaceModel",
    {
      _id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      RaceModelId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      HorseModelId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      GateNo: {
        type: DataTypes.BIGINT,
      },
      HorseNo: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      Equipment: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      TrainerOnRace: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      JockeyOnRace: {
        type: DataTypes.UUID,
      },
      JockeyWeight: {
        type: DataTypes.BIGINT,
     
      },
      OwnerOnRace: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      CapColor: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      JockeyWeight: {
        type: DataTypes.BIGINT,
       
      },
      HorseRunningStatus: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: 1,
      },
      JockeyRaceWeight: {
        type: DataTypes.BIGINT,
      
      },
      Rating: {
        type: DataTypes.BIGINT,
       
      },
    },
    {
      freezeTableName: true,
      paranoid: true,
      initialAutoIncrement: 10,
    }
  );
  return HorseAndRaceModel;
};
