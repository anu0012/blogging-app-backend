'use strict';
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var Schema = mongoose.Schema;


var UserSchema = new Schema({
  username: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  firstname: {
    type: String,
    required: true
  },
  lastname: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true,
  },
  blogURL: {
    type: String,
    required: true,
  },
  followers: {
  	type: [String],
  	default:[]
  }
});

//authenticate input against database
UserSchema.statics.authenticate = function (username, password, callback) {
  User.findOne({ username: username })
    .exec(function (err, user) {
      if (err) {
        return callback(err)
      } else if (!user) {
        var err = new Error('User not found.');
        err.status = 401;
        return callback(err);
      }
      bcrypt.compare(password, user.password, function (err, result) {
        if (result === true) {
          return callback(null, user);
        } else {
          return callback();
        }
      })
    });
}

//hashing a password before saving it to the database
UserSchema.pre('save', function (next) {
  var user = this;
  bcrypt.hash(user.password, 10, function (err, hash) {
    if (err) {
      return next(err);
    }
    user.password = hash;
    next();
  })
});

module.exports = mongoose.model('Users', UserSchema);