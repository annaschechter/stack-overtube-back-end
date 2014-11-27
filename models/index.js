"use strict";

var fs        = require("fs");
var path      = require("path");
var Sequelize = require("sequelize");
var env       = process.env.NODE_ENV || "development";
// var config    = require(__dirname + '/../config/config.json')[env];

if (env === 'production') {
  var sequelize = new Sequelize(process.env.DATABASE_URL);
}
else {
  var sequelize = new Sequelize('stack_over_flow', process.env.DB_USERNAME, process.env.DB_PASSWORD, {
      dialect: "postgres",
      port: 5432
  });
}


var db        = {};

fs
  .readdirSync(__dirname)
  .filter(function(file) {
    return (file.indexOf(".") !== 0) && (file !== "index.js");
  })
  .forEach(function(file) {
    var model = sequelize["import"](path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(function(modelName) {
  if ("associate" in db[modelName]) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;






