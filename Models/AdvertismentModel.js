const { Sequelize } = require("sequelize");
const Db = require("../config/Connection");
const { DataTypes } = Sequelize;

const AdvertismentModel = Db.define(
  "AdvertismentModel",

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
    DescriptionEn: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: "Ad will have description" },
        notEmpty: { msg: "Descritpion  will not be empty" },
      },
    },
    DescriptionAr: {
      type: DataTypes.STRING,
      validate: {
        is: /[\u0600-\u06FF]/,
        is: {
          msg: "Description Must Be In Arabic",
        },
      },
    },
    TitleEn: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    IsActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    TitleAr: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        is: /[\u0600-\u06FF]/,
        is: {
          msg: "Title Must Be In Arabic",
        },
      },
    },
  },
  {
    freezeTableName: true,
    paranoid: true,
  }
);

AdvertismentModel.sync();

module.exports = AdvertismentModel;
// const { Sequelize } = require("sequelize");
// const Db = require("../config/Connection");
// const { DataTypes } = Sequelize;
// const JockeyModel = require("./JockeyModel");

// // JockeyModel.sync();

// const AdvertismentModel = Db.define(
//   "AdvertismentModel",

//   {
//     _id: {
//       type: Sequelize.UUID,
//       defaultValue: Sequelize.UUIDV4,
//       allowNull: false,
//       primaryKey: true,
//     },
//     image: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//     DescriptionEn: {
//       type: DataTypes.STRING,
//       allowNull: false,
//       validate: {
//         notNull: { msg: "Ad will have description" },
//         notEmpty: { msg: "Descritpion  will not be empty" },
//       },
//     },
//     DescriptionAr: {
//       type: DataTypes.STRING,
//       validate: {
//         is: /[\u0600-\u06FF]/,
//         is: {
//           msg: "Description Must Be In Arabic",
//         },
//       },
//     },
//     TitleEn: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//     IsActive: {
//       type: DataTypes.BOOLEAN,
//       defaultValue: true,
//     },
//     TitleAr: {
//       type: DataTypes.STRING,
//       allowNull: false,
//       validate: {
//         is: /[\u0600-\u06FF]/,
//         is: {
//           msg: "Title Must Be In Arabic",
//         },
//       },
//     },

//     JockeyData: {
//       type: DataTypes.UUID,
//       allowNull: false,
//       references: {
//         model: "JockeyModel",
//         key: "_id",
//       },
//     },
//   },
//   {
//     freezeTableName: true,
//     paranoid: true,
//   }
// );
// AdvertismentModel.belongsTo(JockeyModel, {
//   foreignKey: "JockeyData",
//   as: "JockeyModel",
// });

// AdvertismentModel.sync();

// // module.exports = AdvertismentModel;
// const data = await AdvertismentModel.findAll({
//   include: [
//     {
//       model: JockeyModel,
//       as: "JockeyModel",
//     },
//   ],
// });
// res.status(200).json({
//   success: true,
//   data: data,
// });
