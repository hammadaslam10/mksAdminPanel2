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
      Name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      History: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      // Horses: {
      //   type: DataTypes.UUID,
      //   references: {
      //     model: "HorseModel",
      //     key: "_id",
      //   },
      // },

      IsActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      freezeTableName: true,
      paranoid: true,
    }
  );
  return OwnerModel;
};
