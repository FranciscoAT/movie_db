"use strict";

var fs        = require("fs");
var path      = require("path");
var Sequelize = require("sequelize");
<<<<<<< HEAD
var sequelize = new Sequelize('ftrin010', 'ftrin010', 'Campus1605', {
    port: 15432,
    host: 'web0.site.uottawa.ca',
=======
var sequelize = new Sequelize('ofei006', 'ofei006', '0Liver.706', {
    host: 'web0.site.uottawa.ca',
    port: 15432,
>>>>>>> cc18bbcdd89ab372f27bed9c5b7fe59ada56c779
    dialect: 'postgres',
    freezeTableName: true,
    pool: {
        maxConnections: 25,
        minConnections: 0,
        maxIdleTime: 300000
    }
});

var db = {};

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
