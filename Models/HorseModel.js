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
      Breeder: {
        type: DataTypes.UUID,
        allowNull: false,
        // references: {
        //   model: "BreederModel",
        //   key: "_id",
        // },
      },
      Sex: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "SexModel",
          key: "_id",
        },
      },
      DOB: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      ActiveOwner: {
        type: DataTypes.UUID,
        allowNull: false,
        // references: {
        //   model: "OwnerModel",
        //   key: "_id",
        // },
      },
      // ActiveJockey: {
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
        // references: {
        //   model: "TrainerModel",
        //   key: "_id",
        // },
      },
      NationalityId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "NationalityModel",
          key: "_id",
        },
      },
      CreationId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "NationalityModel",
          key: "_id",
        },
      },
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
          notContains: /^[\u0621-\u064A0-9 ]+$/,
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
          is: /^[\u0621-\u064A0-9 ]+$/,
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
      ColorID: {
        type: DataTypes.UUID,
        allowNull: false,
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
