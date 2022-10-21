const Sequelize = require("sequelize");

const Db = new Sequelize("mks", "root", "12345678abc", {
  dialect: "mysql",
  // logging: false,
});
// var options = {
//   host: "database-2.cgk4a7qwslgi.us-west-1.rds.amazonaws.com",
//   port: 3306,
//   logging: console.log,
//   maxConcurrentQueries: 100,
//   dialect: "mysql",
//   ssl: "Amazon RDS",
//   pool: { maxDbions: 5, maxIdleTime: 30 },
//   language: "en",
//   Protocol: "TCP"
// };
// const Db = new Sequelize("mksracingdevtest", "admin", "abc.12345", {
//   ...options
// });

// module.exports = Db;

module.exports = Db;
