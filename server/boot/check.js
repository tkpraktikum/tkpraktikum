var logger = require('winston');

module.exports = function(app, callback) {
  var Role = app.models.Role;

  Role.count().then(function(count) {
    if (count === 0) {
      logger.warn('Roles do not exist. Please create the needed roles.');
    }
    callback();
  });
};
