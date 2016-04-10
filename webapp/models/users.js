"use strict";

var bcrypt = require('bcrypt-nodejs');

module.exports = function(sequelize, DataTypes) {
  var Users = sequelize.define("Users", {
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      isadmin: DataTypes.BOOLEAN
  },
  {
  instanceMethods: {
    validPassword: function(enteredpassword) {
      return bcrypt.compareSync(enteredpassword, this.password);
    }
  }});
  
  Users.beforeCreate(function(user, options) {
    var hash = bcrypt.hashSync(user.password, bcrypt.genSaltSync(8), null);
    user.password = hash;
  });
  return Users;
};
