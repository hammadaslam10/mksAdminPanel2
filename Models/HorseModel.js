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
      Breeder: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      Sex: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      ActiveOwner: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "OwnerModel",
          key: "_id",
        },
      },
      // Owner: {
      //   type: DataTypes.UUID,
      //   references: {
      //     model: "OwnerModel",
      //     key: "_id",
      //   },
      // },
      ActiveJockey: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "JockeyModel",
          key: "_id",
        },
      },
      // Jockey: {
      //   type: DataTypes.UUID,
      //   allowNull: false,
      //   references: {
      //     model: "JockeyModel",
      //     key: "_id",
      //   },
      // },
      ActiveTrainer: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "TrainerModel",
          key: "_id",
        },
      },
      // Trainer: {
      //   type: DataTypes.UUID,
      //   allowNull: false,
      //   references: {
      //     model: "TrainerModel",
      //     key: "_id",
      //   },
      // },
      Dam: {
        type: DataTypes.UUID,
        references: {
          model: "HorseModel",
          key: "_id",
        },
      },
      Sire: {
        type: DataTypes.UUID,
        references: {
          model: "HorseModel",
          key: "_id",
        },
      },
      GSire: {
        type: DataTypes.UUID,
        references: {
          model: "HorseModel",
          key: "_id",
        },
      },

      Age: {
        type: DataTypes.INTEGER,
        // validate: {
        // // is: /^[0-9]+$/,
        //   is: {
        //     msg: "Track Length should be in number",
        //   },
        // },
      },
      Remarks: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      NameEn: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      OverAllRating: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      NameAr: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          is: /[\u0600-\u06FF]/,
          is: {
            msg: "Title Must Be In Arabic",
          },
        },
      },

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
  HorseModel.belongsTo(HorseModel, {
    foreignKey: "Dam",
    as: "DamData",
  });
  HorseModel.belongsTo(HorseModel, {
    foreignKey: "Sire",
    as: "SireData",
  });
  HorseModel.belongsTo(HorseModel, {
    foreignKey: "GSire",
    as: "GSireData",
  });

  return HorseModel;
};

// HorseModel.belongsToMany(JockeyModel, {
//   through: "Jockey",
// });

// HorseModel.belongsToMany(TrainerModel, {
//   through: "Trainer",
// });

// HorseModel.belongsToMany(OwnerModel, {
//   through: "Owner",
// });
// HorseModel.sync();

// module.exports = HorseModel;
