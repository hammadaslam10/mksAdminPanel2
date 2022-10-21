module.exports = (theFunc) => (req, res, next) => {
  Promise.resolve(theFunc(req, res, next)).catch(next);
};
// let RaceCourseData = await RaceCourseModel.findById(data[a].RaceCourse);

// OwnerData = HorseData[i].Owner;
// ActiveTrainerData = await TrainerModel.findById(
//   HorseData[i].ActiveTrainer
// );
// console.log(HorseData[i].ActiveTrainer, "da");

// ActiveTrainerData.image = await getObjectSignedUrl(
//   `${Trainer}/${ActiveTrainerData.image}`
// );
// TrainerData = await TrainerModel.find()
//   .find()
//   .where("_id")
//   .in(HorseData[i].Trainer)
//   .exec();
// JockeyData = await JockeyModel.find()
//   .find()
//   .where("_id")
//   .in(HorseData[i].Jockey)
//   .exec();

// for (let j = i; j < TrainerData.length; j++) {
//   TrainerData[j].image = await getObjectSignedUrl(
//     `${Trainer}/${TrainerData[j].image}`
//   );
// }
// for (let j = i; j < OwnerData.length; j++) {
//   OwnerData[j].image = await getObjectSignedUrl(
//     `${Owner}/${OwnerData[j].image}`
//   );
// }
// for (let j = 0; j < JockeyData.length; j++) {
//   JockeyData[j].image = await getObjectSignedUrl(
//     `${Jockey}/${JockeyData[j].image}`
//   );
// }

// if (!HorseData[i].Sire) {
//   SireData = "N/A";
// } else {
//   SireData = await HorseModel.findbyId(HorseData[i].Sire);
// }
// if (!HorseData[i].GSire) {
//   GSireData = "N/A";
// } else {
//   GSireData = await HorseModel.findbyId(HorseData[i].GSire);
// }
// if (!HorseData[i].Dam) {
//   DamData = "N/A";
// } else {
//   DamData = await HorseModel.findbyId(HorseData[i].Dam);
// }
// RenderData.push({
//   _id: data[a]._id,
//   RaceStatus: data[a].RaceStatus,
//   RaceKind: data[a].RaceKind,
//   raceName: data[a].raceName,
//   Description: data[a].Description,
//   Weather: data[a].Weather,
//   RaceCourseData: RaceCourseData,
//   Horses: [
//     {
//       _id: HorseData[i]._id,
//       NameEn: HorseData[i].NameEn,
//       Age: HorseData[i].Age,
//       NameAr: HorseData[i].NameAr,
//       Breeder: HorseData[i].Breeder,
//       Remarks: HorseData[i].Remarks,
//       HorseRating: HorseData[i].HorseRating,
//       Sex: HorseData[i].Sex,
//       Color: HorseData[i].Color,
//       KindOfHorse: HorseData[i].KindOfHorse,
//       OverAllRating: HorseData[i].OverAllRating,
//       ActiveOwnerData: HorseData[i].ActiveOwnerData,
//       ActiveJockeyData: HorseData[i].ActiveJockeyData,
//       JockeyData: JockeyData,
//       Owner: OwnerData,
//       ActiveTrainer: data[i].ActiveTrainerData,
//       Trainer: TrainerData,
//       ActiveTrainer: ActiveTrainerData,
//       Sire: SireData,
//       GSire: GSireData,
//       Dam: DamData,
//     },
//   ],

//   DayNTime: data[a].DayNTime,
//   created_at: data[a].created_at,
//   updated_at: data[a].updated_at,
// });
// console.log(RenderData);
// }