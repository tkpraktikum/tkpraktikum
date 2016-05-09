var _ = require('underscore');
var logger = require('./../server/logger');

module.exports = function(app, ds, callback) {
  var roles = ['chair', 'author', 'reviewer'];

  var cb = _.after(roles.length, function(err) {
    callback(err);
  });

  _.each(roles, function(role) {
    role = {name: role};
    app.models.Role.create(role, function(err, model) {
      if (!err) {
        logger.log('Created: ' + JSON.stringify(model));
      }
      cb(err);
    });
  });
};
