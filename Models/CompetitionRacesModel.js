// const Sequelize = require("sequelize");
// module.exports = (sequelize, DataTypes) => {
//   const CompetitionRacesModel = sequelize.define(
//     "CompetitionRacesModel",

//     {
//       _id: {
//         type: Sequelize.UUID,
//         defaultValue: Sequelize.UUIDV4,
//         allowNull: false,
//         primaryKey: true,
//       },
//       CompetitionId: {
//         type: DataTypes.UUID,
//         allowNull: false,
//         validate: {
//           notNull: { msg: "Please Add Competition " },
//           notEmpty: {
//             msg: "Without Competition Races Will not get submitted",
//           },
//         },
//       },
//       RaceId: {
//         type: DataTypes.UUID,
//         allowNull: false,
//         validate: {
//           notNull: { msg: "Please Add Race Of Competition" },
//           notEmpty: {
//             msg: "Without Race Competion`s races Will not get submitted",
//           },
//         },
//       },
//       CompetitionStartingDate: {
//         type: DataTypes.DATE,
//         allowNull: false,
//         validate: {
//           notNull: { msg: "Please Add Start Date Of Advertisment" },
//           notEmpty: {
//             msg: "Without Start Date Advertisment Will not get submitted",
//           },
//         },
//       },
//       CompetitionEndDate: {
//         type: DataTypes.DATE,
//         allowNull: false,
//         validate: {
//           notNull: { msg: "Please Add End Data Of Advertisment" },
//           notEmpty: {
//             msg: "Without End Data Advertisment Will not get submitted",
//           },
//         },
//       },
//       NameEn: {
//         type: DataTypes.STRING,
//         allowNull: false,
//         validate: {
//           EnglishLanguageVerification() {
//             if (this.NameEn.trim() == "") {
//               throw new Error("Please Enter  Name in English is Empty");
//             }
//             if (
//               /^[a-zA-Z0-9$-@!%*?&#^_.+]+$/.test(this.NameEn) ||
//               /^[a-zA-Z0-9$-@!%*?&#^_. +]+$/.test(this.NameEn)
//             ) {
//             } else {
//               throw new Error("Name in English Validation Failed");
//             }
//           },
//         },
//       },
//       shortCode: {
//         type: DataTypes.BIGINT,
//         autoIncrement: true,
//         unique: true,
//         allowNull: false,
//         validate: {
//           notNull: { msg: "Competition Category will have Name" },
//           notEmpty: { msg: "Descritpion  will not be empty" },
//         },
//       },
//       NameAr: {
//         type: DataTypes.STRING,
//         validate: {
//           ArabicLanguageVerification() {
//             if (this.NameAr.trim() == "") {
//               throw new Error("Please Enter  Name in  Arabic ");
//             }
//             if (
//               /^[a-zA-Z0-9$-@$!%*?&#^-_,،.+\u0621-\u064A\u0660-\u0669 ]+$/.test(this.NameAr) ||
//               /^[\u0621-\u064A\u0660-\u06690-9a-zA-Z0-9$-@$!%*?&#^-_.+]+$/.test(this.NameAr)
//             ) {
//             } else {
//               throw new Error("Name Arabic Validation Failed");
//             }
//           },
//         },
//       },
//     },
//     {
//       freezeTableName: true,
//       paranoid: true,
//       initialAutoIncrement: 10,
//     }
//   );
//   return CompetitionRacesModel;
// };
