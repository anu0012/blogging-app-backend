'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var BlogSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Blogs', BlogSchema);