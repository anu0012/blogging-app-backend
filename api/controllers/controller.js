'use strict';

var mongoose = require('mongoose'),
  Blog = mongoose.model('Blogs'),
  User = mongoose.model('Users');

  exports.create_a_user = function(req, res) {
  if (req.body.firstname && req.body.lastname &&
    req.body.username &&
    req.body.password &&
    req.body.blogURL) {

    var userData = {
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      username: req.body.username,
      password: req.body.password,
      blogURL: req.body.blogURL,
    }

    User.create(userData, function (error, user) {
      if (error) {
        return res.send(error);
      } else {
        req.session.userId = user._id;
        req.session.user = user;
        return res.redirect('/blogs');
      }
    });

  } else {
    var err = new Error('All fields required.');
    err.status = 400;
    return res.send("Status: " + err.status + " Message: "+err.message);
  }

};

exports.login_a_user = function(req, res) {
  if (req.body.username && req.body.password) {
    User.authenticate(req.body.username, req.body.password, function (error, user) {
      if (error || !user) {
        var err = new Error('Wrong email or password.');
        err.status = 401;
        return res.send("Status: " + err.status + " Message: "+err.message);
      } else {
        req.session.userId = user._id;
        req.session.user = user;
        return res.redirect('/blogs');
      }
    });
  } else {
    var err = new Error('All fields required.');
    err.status = 400;
    return res.send("Status: " + err.status + " Message: "+err.message);
  }
};

exports.list_all_blogs = function(req, res) {
  Blog.find({}, function(err, blog) {
    if (err)
      res.send(err);

    var followers_list = []
    if(req.session.user != undefined)
    followers_list = req.session.user.followers;

    // loop through all blogs and check which belong to followers
    if(followers_list != undefined && followers_list.length != 0){
        var followers_blogs = []
        for(var i=0;i<followers_list.length;i++){
            for(var j=0;j<blog.length;j++){
              if(followers_list[i] == blog[j].author)
                followers_blogs.push(blog[j]);
            }
        }
        res.json(followers_blogs);
    }
    else{
        res.send("Feed is empty.");
    }
  });
};


exports.create_a_blog = function(req, res) {
  
  if(req.session.user != undefined)
      req.body.author = req.session.user.username;
    
  var new_blog = new Blog(req.body);
  
  new_blog.save(function(err, blog) {
    if (err)
      res.send(err);
    res.json(blog);
  });
};

exports.add_follower = function(req, res) {
  if(req.session.user == undefined)
        res.send('No user found');
  else{
  User.findById(req.session.user._id, function (err, user) {
    if (!user) {
        res.send(err);
    }

    var x = user.followers;
    x.push(req.body.username);
    user.followers = x
    user.save(function (err) {

    if (err)
      res.send(err);

    req.session.userId = user._id;
    req.session.user = user;
    res.redirect('/blogs');
    });
  });
}
};


