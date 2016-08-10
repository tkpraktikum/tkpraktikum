var logger = require('winston');
var _ = require('underscore');

module.exports = function(app, ds, callback) {

  app.models.Role.find({}, function(err, roles) {
    if(err) return callback(err);
    var chair = roles.filter(function(r) {return r.name === 'chair'})[0];
    var author = roles.filter(function(r) {return r.name === 'author'})[0];

    var users = [
      {
        username: 'chair',
        password: 'chair',
        email: 'chair@chair.de',
        emailVerified: true
      },
      {
        username: 'author',
        password: 'author',
        email: 'author@author.de',
        emailVerified: true
      }
    ];

    var userRoles  = {
        "chair@chair.de": [chair, author],
        "author@author.de": [author]
      };

    app.models.user.create(users, function(err, model) {
        if(err) return callback(err);
        var principals = model.map(function(u) {
          return userRoles[u.email].map(function (role) {
            return {
              principalType: app.models.roleMapping.USER,
              principalId: u.id,
              roleId: role.id
            };
          });
        });
        principals = _.flatten(principals);
        app.models.roleMapping.create(principals, function(err) {
          if(err) return callback(err);
          logger.info("created user role mapping");
          callback(err);
        });
      });
    });
};
