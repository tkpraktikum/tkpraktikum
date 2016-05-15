var logger = require('winston');

module.exports = function(app, ds, callback) {
  
  app.models.Role.find({}, function(err, roles) {
    if(err) return callback(err);
    var chair = roles.filter(function(r) {return r.name === 'chair'})[0];
  
    var users = [
      {
        username: 'chair',
        password: 'chair',
        email: 'chair@chair.de',
        emailVerified: true
      }
    ];
    
    var userRoles  = {
        "chair@chair.de": chair
      };

    app.models.user.create(users, function(err, model) {
        if(err) return callback(err);
        var principals = model.map(function(u) {
          return {
            principalType: app.models.RoleMapping.USER,
            principalId: u.id,
            roleId: userRoles[u.email].id
          };
        });
        app.models.RoleMapping.create(principals, function(err) {
          if(err) return callback(err);
          logger.info("created user role mapping");
          callback(err);
        });
      });
    });
};
