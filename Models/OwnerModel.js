const Sequelize = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  const OwnerModel = sequelize.define(
    "OwnerModel",

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
      NationalityID: {
        type: DataTypes.UUID,
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
      ShortEn: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      ShortAr: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      RegistrationDate: {
        type: DataTypes.DATE,
        allowNull: false,
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
  return OwnerModel;
};
