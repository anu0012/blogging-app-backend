'use strict';

var mongoose = require('mongoose'),
  Blog = mongoose.model('Blogs'),
  User = mongoose.model('Users');

  exports.create_a_user = function(req, res,next) {
  var new_user = new User(req.body);
  //console.log(req.body);
  //new_user.save(function(err, res) {
  //   if (err)
  //     res.send(err);
  //   res.json(blog);
  // });
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
        return next(error);
      } else {
        req.session.userId = user._id;
        req.session.user = user;
        return res.redirect('/blogs');
      }
    });

  } else {
    var err = new Error('All fields required.');
    err.status = 400;
    return next(err);
  }

};

exports.login_a_user = function(req, res,next) {
  //console.log(req.body.username);
  if (req.body.username && req.body.password) {
    User.authenticate(req.body.username, req.body.password, function (error, user) {
      if (error || !user) {
        var err = new Error('Wrong email or password.');
        err.status = 401;
        return next(err);
      } else {
        req.session.userId = user._id;
        req.session.user = user;
        return res.redirect('/blogs');
      }
    });
  } else {
    var err = new Error('All fields required.');
    err.status = 400;
    return next(err);
  }

};

exports.list_all_blogs = function(req, res) {
  
  //if(req.session.userId == user._id){
  Blog.find({}, function(err, blog) {
    if (err)
      res.send(err);

    var followers_list = []
    followers_list = req.session.user.followers;
    // loop through all blogs and check which belong to followers

    if(followers_list != undefined && followers_list.length != 0){

        followers_blogs = []
        for(var i=0;i<followers_list.length;i++){
            for(var j=0;j<blog.length;j++){
              if(followers_list[i] == blog[j].author)
                followers_blogs.push(blog[j]);
            }
        }

        res.json(followers_blogs);
    }
    else{
        res.json("{'blogs':'no blogs found'}");
    }
    
  });
 //}
};


exports.create_a_blog = function(req, res) {
  
  req.body.author = req.session.user.username;
  //console.log(req.session.user.username);
  var new_blog = new Blog(req.body);
  
  new_blog.save(function(err, blog) {
    if (err)
      res.send(err);
    res.json(blog);
  });
};


exports.get_followers = function(req, res) {
  User.findById(req.params.blogId, function(err, blog) {
    if (err)
      res.send(err);
    res.json(blog);
  });
};


exports.add_follower = function(req, res) {

  User.findById(req.session.user._id, function (err, user) {
        if (!user) {
            //res.json("please login");
            res.send(err);
        }
        console.log(user);
        var x = user.followers
        x.push(req.body.username);
        user.followers = x
        user.save(function (err) {

            if (err)
              res.send(err);
            res.redirect('/blogs');
        });
  });
};


