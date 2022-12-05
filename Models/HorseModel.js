const Sequelize = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  const HorseModel = sequelize.define(
    "HorseModel",

    {
      _id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      HorseImage: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      HorseCode: {
        type: DataTypes.STRING,
      },
      HorseKind: {
        type: DataTypes.UUID,
      },
      Breeder: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      Sex: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      DOB: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      ActiveOwner: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      ActiveTrainer: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      NationalityID: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      CreationId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      Dam: {
        type: DataTypes.UUID,
      },
      Sire: {
        type: DataTypes.UUID,
      },
      GSire: {
        type: DataTypes.UUID,
      },

      Foal: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      Remarks: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      NameEn: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notContains: /(\w*[ء-ي]\w*)/gm,
          notContains: {
            msg: "Name Must Be In English",
          },
          notNull: { msg: "Horse will have Name" },
          notEmpty: { msg: "Name   will not be empty" },
        },
      },

      NameAr: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          is: /(\w*[ء-ي]\w*)/gm,
          is: {
            msg: "Title Must Be In Arabic",
          },
        },
      },
      PurchasePrice: {
        type: DataTypes.DOUBLE,
        allowNull: false,
      },
      isGelded: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: 0,
      },
      STARS: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      Rds: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: 0,
      },
      HorseStatus: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: 0,
      },
      ColorID: {
        type: DataTypes.UUID,
        allowNull: false,
      },
    },
    {
      freezeTableName: true,
      paranoid: true,
      initialAutoIncrement: 1000,
    }
  );

  return HorseModel;
};

// HorseModel.belongsToMany(JockeyModel, {
//   through: "Jockey",
// });

// HorseModel.belongsToMany(TrainerModel, {
//   through: "Trainer",
//   as: "TrainerData",
// });

// HorseModel.belongsToMany(OwnerModel, {
//   through: "Owner",
//   as: "OwnerData",
// });
// HorseModel.sync();

// module.exports = HorseModel;
