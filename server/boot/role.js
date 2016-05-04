var _ = require("underscore");

module.exports = function(app, callback) {
  var Role = app.models.Role;

  Role.count().then(function(count) {
    if (count === 0) {
      console.log("Roles do not exist, yet");
      var roles = ['chair', 'author', 'reviewer'];
      var cb = _.after(roles.length, function() {
        callback();
      });
      _.each(roles, function(role) {
        Role.create({
          name: role
        }, function(err, role) {
          if (err) throw err;
          console.log('Created role:', role);
          cb();
        });
      });
    } else {
      console.log("Roles already exist");
      callback();
    }
  });
};
