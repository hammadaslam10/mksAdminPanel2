const Sequelize = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  const SliderModel = sequelize.define(
    "SliderModel",

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
      TitleEn: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Slider will have Title" },
          notEmpty: { msg: "Title  will not be empty" },
        },
      },
      TitleAr: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          is: /^[ء-ي\s]+[\s]*$/,
          is: {
            msg: "Title Must Be In Arabic",
          },
        },
      },
      Url: {
        type: DataTypes.STRING,
      },
    },
    {
      freezeTableName: true,
      paranoid: true,
    }
  );
  return SliderModel;
};
