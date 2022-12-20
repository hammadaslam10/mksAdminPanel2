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
        validate: {
          notNull: { msg: "Please Add Image Of Horse" },
          notEmpty: {
            msg: "Without Image Horse Will not get submitted",
          },
        },
      },
      shortCode: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        unique: true,
        allowNull: false,
      },
      KindHorse: {
        type: DataTypes.UUID,
        allowNull: false,
        validate: {
          notNull: { msg: "Please Add Kind Of Horse" },
          notEmpty: {
            msg: "Without Kind Horse Will not get submitted",
          },
        },
      },
      Breeder: {
        type: DataTypes.UUID,
        allowNull: false,
        validate: {
          notNull: { msg: "Please Add Breeder Of Horse" },
          notEmpty: {
            msg: "Without Breeder Horse Will not get submitted",
          },
        },
      },
      Sex: {
        type: DataTypes.UUID,
        allowNull: false,
        validate: {
          notNull: { msg: "Please Add Sex Of Horse" },
          notEmpty: {
            msg: "Without Sex Horse Will not get submitted",
          },
        },
      },
      DOB: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          notNull: { msg: "Please Add Date of birth Of Horse" },
          notEmpty: {
            msg: "Without Date of birth Horse Will not get submitted",
          },
        },
      },
      ActiveOwner: {
        type: DataTypes.UUID,
        allowNull: false,
        validate: {
          notNull: { msg: "Please Add Owner Of Horse" },
          notEmpty: {
            msg: "Without Owner Horse Will not get submitted",
          },
        },
      },
      ActiveTrainer: {
        type: DataTypes.UUID,
        allowNull: false,
        validate: {
          notNull: { msg: "Please Add Trainer Of Horse" },
          notEmpty: {
            msg: "Without Trainer Horse Will not get submitted",
          },
        },
      },
      NationalityID: {
        type: DataTypes.UUID,
        allowNull: false,
        validate: {
          notNull: { msg: "Please Add Nationality Of Horse" },
          notEmpty: {
            msg: "Without Nationality Horse Will not get submitted",
          },
        },
      },
      CreationId: {
        type: DataTypes.UUID,
        allowNull: false,
        validate: {
          notNull: { msg: "Please Add Creation Of Horse" },
          notEmpty: {
            msg: "Without Creation Horse Will not get submitted",
          },
        },
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
      RemarksEn: {
        type: DataTypes.STRING,
        allowNull: false,
        EnglishLanguageVerification() {
          if (this.RemarksEn.trim() == "") {
            throw new Error("Please Enter remarks in English ");
          }
          if (
            /^[a-zA-Z0-9$@$!%*?&#^-_.+]+$/.test(this.RemarksEn) ||
            /^[a-zA-Z0-9$@$!%*?&#^-_. +]+$/.test(this.RemarksEn)
          ) {
          } else {
            throw new Error("remarks English Validation Failed");
          }
        },
      },
      RemarksAr: {
        type: DataTypes.STRING,
        allowNull: false,
        ArabicLanguageVerification() {
          if (this.RemarksAr.trim() == "") {
            throw new Error("Please Enter  Remarks in  Arabic ");
          }
          if (
            /^[\u0621-\u064A\u0660-\u06690-9a-zA-Z0-9$-@$!%*?&#^-_.+ ]+$/.test(this.RemarksAr) ||
            /^[\u0621-\u064A\u0660-\u06690-9a-zA-Z0-9$-@$!%*?&#^-_.+]+$/.test(this.RemarksAr)
          ) {
          } else {
            throw new Error("Remarks Arabic Validation Failed");
          }
        },
      },
      NameEn: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          EnglishLanguageVerification() {
            if (this.NameEn.trim() == "") {
              throw new Error("Please Enter Name in English ");
            }
            if (
              /^[a-zA-Z0-9$@$!%*?&#^-_.+]+$/.test(this.NameEn) ||
              /^[a-zA-Z0-9$@$!%*?&#^-_. +]+$/.test(this.NameEn)
            ) {
            } else {
              throw new Error("Name English Validation Failed");
            }
          },
        },
      },

      NameAr: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          ArabicLanguageVerification() {
            if (this.NameAr.trim() == "") {
              throw new Error("Please Enter  Name in  Arabic ");
            }
            if (
              /^[\u0621-\u064A\u0660-\u06690-9a-zA-Z0-9$-@$!%*?&#^-_.+ ]+$/.test(this.NameAr) ||
              /^[\u0621-\u064A\u0660-\u06690-9a-zA-Z0-9$-@$!%*?&#^-_.+]+$/.test(this.NameAr)
            ) {
            } else {
              throw new Error("Name Arabic Validation Failed");
            }
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
        validate: {
          notNull: { msg: "Please Add Image Of Horse" },
          notEmpty: {
            msg: "Without Image Horse Will not get submitted",
          },
        },
      },
      Height: {
        type: DataTypes.BIGINT,
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
