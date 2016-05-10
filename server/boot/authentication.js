module.exports = function enableAuthentication(app) {
  // enable authentication
  app.enableAuth();

  var Role = app.models.Role;

  Role.registerResolver('authorOwner', function(role, context, callback) {
    if (!context || !context.model || !context.modelId) {
      process.nextTick(function() {
        if (callback) callback(null, false);
      });
      return;
    }
    var modelClass = context.model;
    var modelId = context.modelId;
    var userId = context.getUserId();
    var user = context.user;
    //user.
    Role.isOwner(modelClass, modelId, userId, callback);
  });

};
