var _ = require('underscore');
var logger = require('winston');

module.exports = function(app, callback) {
  var Role = app.models.Role;

  var cb = _.after(3, function(err) {
    if(err) {
      logger.error(err);
    }
    callback();
  });

  _.each(['chair', 'author', 'reviewer'], function(roleName) {
    Role.findOne({where: {name: roleName}}, function(err, role) {
      Role[roleName.toUpperCase()] = role;
      cb(err);
    });
  });
};

