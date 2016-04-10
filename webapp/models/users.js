"use strict";

var bcrypt = require('bcrypt-nodejs');

module.exports = function(sequelize, DataTypes) {
  var Users = sequelize.define("Users", {
      email: DataTypes.STRING,
      password: DataTypes.STRING
  },
  {
       tableName: 'Users'
  },
  {
    hooks: {
      beforeCreate : function(user, options, next) {
        bcrypt.genSalt(10, function(err, salt) {
          bcrypt.hash(user.password, salt, function(err, hash) {
            user.password = hash;
            next(null, user);
          });
        });
      }
    },

    instanceMethods: {
      validPassword: function(password) {
        return bcrypt.compareSync(password, this.password);
      }
    }
  });
  return Users;
};

