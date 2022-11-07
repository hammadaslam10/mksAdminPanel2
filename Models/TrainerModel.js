const Sequelize = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  const TrainerModel = sequelize.define(
    "TrainerModel",

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
      NameEn: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      NameAr: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      TitleEn: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      TitleAr: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      DOB: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      JockeyLicenseDate: {
        type: DataTypes.DATE,
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
      Detail: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Trainer will have Detail" },
          notEmpty: { msg: "Detail  will not be empty" },
        },
      },
      Age: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      Rating: {
        type: DataTypes.BIGINT,
        allowNull: false,
        validate: {
          notNull: { msg: "Trainer will have Rating" },
          notEmpty: { msg: "Rating  will not be empty" },
        },
      },
      Remarks: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Trainer will have Remarks" },
          notEmpty: { msg: "Remarks  will not be empty" },
        },
      },
    },
    {
      freezeTableName: true,
      paranoid: true,
    }
  );
  return TrainerModel;
};
