'use strict';


var mongoose = require('mongoose'),
  Blog = mongoose.model('Blogs');

exports.list_all_blogs = function(req, res) {
  Blog.find({}, function(err, blog) {
    if (err)
      res.send(err);
    res.json(blog);
  });
};


exports.create_a_blog = function(req, res) {
  var new_blog = new Blog(req.body);
  //console.log(req.body);
  new_blog.save(function(err, blog) {
    if (err)
      res.send(err);
    res.json(blog);
  });
};


exports.read_a_blog = function(req, res) {
  Blog.findById(req.params.blogId, function(err, blog) {
    if (err)
      res.send(err);
    res.json(blog);
  });
};


exports.update_a_blog = function(req, res) {
  Blog.findOneAndUpdate({_id: req.params.blogId}, req.body, {new: true}, function(err, blog) {
    if (err)
      res.send(err);
    res.json(blog);
  });
};


exports.delete_a_blog = function(req, res) {


  Blog.remove({
    _id: req.params.blogId
  }, function(err, blog) {
    if (err)
      res.send(err);
    res.json({ message: 'Blog successfully deleted' });
  });
};

