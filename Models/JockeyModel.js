const Sequelize = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  const JockeyModel = sequelize.define(
    "JockeyModel",

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
      Age: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      DOB: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      NameEn: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      NameAr: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      ShortNameEn: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      ShortNameAr: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      Age: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      Rating: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },

      JockeyLicenseDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      Remarks: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      MiniumumJockeyWeight: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      JockeyAllowance: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
    },
    {
      freezeTableName: true,
      paranoid: true,
    }
  );
  return JockeyModel;
};
