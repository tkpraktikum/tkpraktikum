var _ = require('underscore');
var logger = require('./../server/logger');

module.exports = function(app, ds, callback) {
  var users = [
    {
      username: 'chair',
      password: 'chair',
      email: 'chair@chair.de'
    }
  ];

  var cb = _.after(users.length, function(err) {
    callback(err);
  });

  _.each(users, function(user) {
    user.emailVerified = true;
    app.models.user.create(user, function(err, model) {
      if (err) {
        cb(err);
      } else {
        logger.info('Created: ' + JSON.stringify(model));

        app.models.Role.findOne({name: 'chair'}, function (err, role) {
          if (err) {
            cb(err);
          } else {
            role.principals.create({
              principalType: app.models.RoleMapping.USER,
              principalId: model.id
            }, function (err, principal) {
              if (!err) {
                logger.info('Created :', principal);
              }
              cb(err);
            });
          }
        });
      }
    });
  });
};
