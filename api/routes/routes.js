'use strict';
module.exports = function(app) {
  var blogAPI = require('../controllers/controller');

  // blogAPI Routes
  app.route('/blogs')
    .get(blogAPI.list_all_blogs)
    .post(blogAPI.create_a_blog);


  app.route('/follow/')
    .put(blogAPI.add_follower);

  app.route('/register')
    .post(blogAPI.create_a_user);

  app.route('/login')
    .post(blogAPI.login_a_user);
};
