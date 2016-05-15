var _ = require('underscore');
var logger = require('winston');

module.exports = function(app, ds, callback) {
  var roles = ['chair', 'author', 'reviewer'];
  
  roles = roles.map(function (r) {return {name: r};});

  app.models.Role.create(roles, function(err) {
    if (!err) {
      logger.info('Created roles');  
    }
    callback(err);
  });
};
