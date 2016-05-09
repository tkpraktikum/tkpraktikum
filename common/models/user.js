var _ = require('underscore');
var logger = require('./../../server/logger');

// see https://docs.strongloop.com/display/public/LB/Accessing+related+models
module.exports = function(User) {

  var getFlagUpdater = function(name) {
    return function(status, cb) {
      var userId = this.toJSON().id;
      var app = User.app;
      var Role = app.models.Role;
      var RoleMapping = app.models.RoleMapping;
      Role.findOne({where: {name: name}}, function (err, role) {
        if (err) {
          cb(err, status);
        } else {
          if (status) {
            role.principals.create({
              principalType: RoleMapping.USER,
              principalId: userId
            }, function (err, principal) {
              if (!err) {
                logger.info('Created :', principal);
              }
              cb(err, status);
            });
          } else {
            RoleMapping.destroyAll({and: [{roleId: role.id}, { principalId: userId}]}, function(err, info) {
              if(err) {
                logger.error(err);
              }
              cb(err, false);
            });
          }
        }
      });
    };
  };

  User.prototype.author = getFlagUpdater('author');
  User.prototype.reviewer = getFlagUpdater('reviewer');

  User.remoteMethod(
    'author',
    {
      http: {verb: 'put' },
      isStatic: false,
      description: 'Modify authorship status',
      notes: 'set status of authorship',
      accepts: { arg: 'status', type: 'boolean', required: true},
      returns: { arg: 'status', type: 'boolean' }
    }
  );

  User.remoteMethod(
    'reviewer',
    {
      http: {verb: 'put' },
      isStatic: false,
      description: 'Modify reviewer status',
      notes: 'set status of reviewer',
      accepts: { arg: 'status', type: 'boolean', required: true},
      returns: { arg: 'status', type: 'boolean' }
    }
  );

  User.afterRemote('find', function(ctx, instance, next) {
    var result = [];

    var cb = _.after(ctx.result.length, function(err) {
      if(err) {
        logger.error(err);
      }
      ctx.result = result.map(function(user) {
        return {
          username: user.username,
          email: user.email,
          id: user.id,
          isAuthor: user.roles.indexOf('author') !== -1,
          isReviewer: user.roles.indexOf('reviewer') !== -1,
          isChair: user.roles.indexOf('chair') !== -1
        };
      });
      next();
    });

    _.each(ctx.result, function(user) {
      user.roles({id: user.id}).then(function (res) {
        user = user.toJSON();
        user.roles = res.map(function(e) { return e.toJSON().name; });
        result.push(user);
        cb();
      });
    });
  });

  User.afterRemote('prototype.__get__submissions', function( ctx, instance, next) {
    // enrich response with user information
    var result = [];
    var cb = _.after(ctx.result.length, function() {
      ctx.result = result;
      logger.info(JSON.stringify(result));
      next();
    });
    _.each(ctx.result, function(submission) {
      submission.authors({id: submission.id})
        .then(function (res) {
          var authors = [];
          res.forEach(function(user) {
            authors.push({
              username: user.username,
              id: user.id
            });
          });
          submission = submission.toJSON();
          submission.authors = authors;
          result.push(submission);
          cb();
      }, function(error) {
          logger.err(error);
          cb();
        });
    });
  });
};
