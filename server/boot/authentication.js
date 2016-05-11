module.exports = function enableAuthentication(app) {
  // enable authentication
  app.enableAuth();

  var Role = app.models.Role;
  var RoleMapping = app.models.RoleMapping;

  Role.registerResolver('$authorOwner', function(role, context, callback) {
    if (!context || !context.model || !context.modelId) {
      process.nextTick(function() {
        if (callback) callback(null, false);
      });
      return;
    }
    var modelClass = context.model;
    var modelId = context.modelId;
    var userId = context.getUserId();

    Role.isOwner(modelClass, modelId, userId, function(err, owner) {
      if (err || !owner) {
        return callback(err, owner);
      }

      RoleMapping
        .findOne({where: {and: [{roleId: Role.AUTHOR.id}, { principalId: userId}]}})
        .then(function(result) {
          callback(null, result !== null);
        })
        .catch(function(err) {
          callback(err);
        });
    });
  });

};
