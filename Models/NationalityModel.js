const Sequelize = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  const NationalityModel = sequelize.define(
    "NationalityModel",

    {
      _id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
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
              /^[a-zA-Z0-9$-@!%*?&#^_.+]+$/.test(this.NameEn) ||
              /^[a-zA-Z0-9$-@!%*?&#^_. +]+$/.test(this.NameEn)
            ) {
            } else {
              throw new Error("Name English Validation Failed");
            }
          },
        },
      },
      shortCode: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        unique: true,
        allowNull: false,
        validate: {
          notNull: { msg: "Nationality Category will have shortCode" },
          notEmpty: { msg: "shortCode  will not be empty" },
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
              /^[a-zA-Z0-9$-@$!%*?&#^-_,،.+\u0621-\u064A\u0660-\u0669 ]+$/.test(
                this.NameAr
              ) ||
              /^[\u0621-\u064A\u0660-\u06690-9a-zA-Z0-9$-@$!%*?&#^-_.+]+$/.test(
                this.NameAr
              )
            ) {
            } else {
              throw new Error("Name Arabic Validation Failed");
            }
          },
        },
      },
      AbbrevEn: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          EnglishLanguageVerification() {
            if (this.AbbrevEn.trim() == "") {
              throw new Error("Please Enter Abbreviation Name in English");
            }
            if (
              /^[a-zA-Z0-9$-@!%*?&#^_.+]+$/.test(this.AbbrevEn) ||
              /^[a-zA-Z0-9$-@!%*?&#^_. +]+$/.test(this.AbbrevEn)
            ) {
            } else {
              throw new Error("Abbreviation Name English Validation Failed");
            }
          },
        },
      },
      AbbrevAr: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          ArabicLanguageVerification() {
            if (this.AbbrevAr.trim() == "") {
              throw new Error("Please Enter  Abbreviation in  Arabic ");
            }
            if (
              /^[a-zA-Z0-9$-@$!%*?&#^-_,،.+\u0621-\u064A\u0660-\u0669 ]+$/.test(
                this.AbbrevAr
              ) ||
              /^[\u0621-\u064A\u0660-\u06690-9a-zA-Z0-9$-@$!%*?&#^-_.+]+$/.test(
                this.AbbrevAr
              )
            ) {
            } else {
              throw new Error("Abbreviation Arabic Validation Failed");
            }
          },
        },
      },
      AltNameEn: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          EnglishLanguageVerification() {
            if (this.AltNameEn.trim() == "") {
              throw new Error("Please Enter Alternate Name in English");
            }
            if (
              /^[a-zA-Z0-9$-@!%*?&#^_.+]+$/.test(this.AltNameEn) ||
              /^[a-zA-Z0-9$-@!%*?&#^_. +]+$/.test(this.AltNameEn)
            ) {
            } else {
              throw new Error("Alternate Name English Validation Failed");
            }
          },
        },
      },
      AltNameAr: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          ArabicLanguageVerification() {
            if (this.AltNameAr.trim() == "") {
              throw new Error("Please Enter  Alternate Name in  Arabic ");
            }
            if (
              /^[a-zA-Z0-9$-@$!%*?&#^-_,،.+\u0621-\u064A\u0660-\u0669 ]+$/.test(
                this.AltNameAr
              ) ||
              /^[\u0621-\u064A\u0660-\u06690-9a-zA-Z0-9$-@$!%*?&#^-_.+]+$/.test(
                this.AltNameAr
              )
            ) {
            } else {
              throw new Error("Alternate Name Arabic Validation Failed");
            }
          },
        },
      },
      // LabelEn: {
      //   type: DataTypes.STRING,
      //   allowNull: false,
      //   validate: {
      //     EnglishLanguageVerification() {
      //       if (this.LabelEn.trim() == "") {
      //         throw new Error("Please Enter Description in English");
      //       }
      //       if (
      //         /^[a-zA-Z0-9$-@!%*?&#^_.+]+$/.test(this.LabelEn) ||
      //         /^[a-zA-Z0-9$-@!%*?&#^_. +]+$/.test(this.LabelEn)
      //       ) {
      //       } else {
      //         throw new Error("Description English Validation Failed");
      //       }
      //     },
      //   },
      // },

      // LabelAr: {
      //   type: DataTypes.STRING,
      //   allowNull: false,
      //   validate: {
      //     ArabicLanguageVerification() {
      //       if (this.LabelAr.trim() == "") {
      //         throw new Error("Please Enter  Label Name in  Arabic ");
      //       }
      //       if (
      //         /^[a-zA-Z0-9$-@$!%*?&#^-_,،.+\u0621-\u064A\u0660-\u0669 ]+$/.test(this.LabelAr) ||
      //         /^[\u0621-\u064A\u0660-\u06690-9a-zA-Z0-9$-@$!%*?&#^-_.+]+$/.test(this.LabelAr)
      //       ) {
      //       } else {
      //         throw new Error("Label Name Arabic Validation Failed");
      //       }
      //     },
      //   },
      // },

      // Offset: {
      //   type: DataTypes.BOOLEAN,
      //   allowNull: false,
      // },
      HemisphereEn: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue:"Southern Hemisphere",
        // EnglishLanguageVerification() {
        //   if (this.HemisphereEn.trim() == "") {
        //     throw new Error("Please Enter Hemisphere in English");
        //   }
        //   if (
        //     /^[a-zA-Z0-9$-@!%*?&#^_.+]+$/.test(this.HemisphereEn) ||
        //     /^[a-zA-Z0-9$-@!%*?&#^_. +]+$/.test(this.HemisphereEn)
        //   ) {
        //   } else {
        //     throw new Error("Hemisphere English Validation Failed");
        //   }
        // },
      },
      HemisphereAr: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue:"نصف الكرة الجنوبي",
        // validate: {
        //   ArabicLanguageVerification() {
        //     if (this.HemisphereAr.trim() == "") {
        //       throw new Error("Please Enter  Hemisphere in  Arabic ");
        //     }
        //     if (
        //       /^[a-zA-Z0-9$-@$!%*?&#^-_,،.+\u0621-\u064A\u0660-\u0669 ]+$/.test(
        //         this.HemisphereAr
        //       ) ||
        //       /^[\u0621-\u064A\u0660-\u06690-9a-zA-Z0-9$-@$!%*?&#^-_.+]+$/.test(
        //         this.HemisphereAr
        //       )
        //     ) {
        //     } else {
        //       throw new Error("Alternate Value  Validation Failed");
        //     }
        //   },
        // },
      },
      image: {
        type: DataTypes.STRING,
        // allowNull: false,
        // validate: {
        //   notNull: { msg: "Please Add Image Of Nationality" },
        //   notEmpty: {
        //     msg: "Without Image Nationality Will not get submitted",
        //   },
        // },
      },
      BackupId: {
        type: DataTypes.BIGINT,
        defaultValue: null,
      },
    },
    {
      freezeTableName: true,
      paranoid: true,
      initialAutoIncrement: 10,
    }
  );
  return NationalityModel;
};
