const Sequelize = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  const PointTableSystemModel = sequelize.define(
    "PointTableSystemModel",

    {
      _id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      Race: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      Point: {
        type: DataTypes.UUID,
        allowNull: false,
      },
    },
    {
      freezeTableName: true,
      paranoid: true,
    }
  );
  return PointTableSystemModel;
};
