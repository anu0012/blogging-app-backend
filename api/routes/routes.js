'use strict';
module.exports = function(app) {
  var blogList = require('../controllers/controller');

  // blogList Routes
  app.route('/blogs')
    .get(blogList.list_all_blogs)
    .post(blogList.create_a_blog);


  app.route('/blogs/:blogId')
    .get(blogList.read_a_blog)
    .put(blogList.update_a_blog)
    .delete(blogList.delete_a_blog);

  app.route('/register')
    .post(blogList.create_a_user);
};
