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
      Rating: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      NationalityID: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      JockeyLicenseDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      RemarksEn: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Jockey will have Remarks" },
          notEmpty: { msg: "Remarks  will not be empty" },
        },
      },
      RemarksAr: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          is: /^[\u0621-\u064A\u0660-\u0669]*$/gm,
          is: {
            msg: "Jockey Must Be In Arabic",
          },
        },
      },
      MiniumumJockeyWeight: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      MaximumJockeyWeight: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      JockeyAllowance: {
        type: DataTypes.DOUBLE,
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
