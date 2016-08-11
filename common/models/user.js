var _ = require('underscore');
var async = require('async');
var logger = require('./../../server/logger');

// see https://docs.strongloop.com/display/public/LB/Accessing+related+models
module.exports = function(User) {

  User.prototype.getLatestAccessToken = function(callback) {
    var user = this;
    User.app.models.AccessToken
      .findOne({where : {userId: this.id}, order: 'created DESC'})
      .then(function (token) {
        if (token === null) {
          user.createAccessToken(3600, function(err, token) {
            callback(err, token);
          });
        } else {
          callback(null, token);
        }
      })
      .catch(function (err) {
        callback(err);
      })
  };

  User.prototype.removeRole = function(role, callback) {
    var RoleMapping = User.app.models.roleMapping;
    RoleMapping.destroyAll({and: [{roleId: role.id}, { principalId: this.id}]}, function(err, info) {
      if(err) {
        logger.error(err);
      }
      logger.info('Removed ' + info.count + ' items');
      callback(err);
    });
  };

  User.prototype.addRole = function(role, callback) {
    var RoleMapping = User.app.models.roleMapping;

    var principals = [{
      principalType: User.app.models.roleMapping.USER,
      principalId: this.id,
      roleId: role.id
    }];
    RoleMapping.create(principals, function(err) {
      if (!err) {
        logger.info('Created :', principals);
      }
      callback(err);
    });
  };

  User.prototype.getRoles = function() {
    return this.roles({id: this.id});
  };

  User.prototype.getAllAuthors = function(submission, callback) {
    submission.authors({id: submission.id})
      .then(function (authors) {
        callback(null, authors);
      }, function(err) {
        logger.error(err);
        callback(err);
      });
  };

  var createFlagUpdater = function(name) {
    return function(status, cb) {
      var role = User.app.models.Role[name];
      if (status) {
        this.addRole(role, function(err) {
          cb(err, status);
        })
      } else {
        this.removeRole(role, function(err) {
          cb(err, status);
        })
      }
    };
  };

  User.prototype.author = createFlagUpdater('AUTHOR');
  User.prototype.reviewer = createFlagUpdater('REVIEWER');

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
    if (ctx.processed) {
      return next();
    }
    ctx.processed = true;
    var result = [];

    var cb = _.after(instance.length, function (err) {
      if (err) {
        logger.error(err);
      }
      ctx.result = result.map(function (user) {
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

    _.each(instance, function (user) {
      user.getRoles().then(function (roles) {
        var newUser = user.toJSON();
        newUser.roles = roles.map(function (r) {
          return r.toJSON().name;
        });
        result.push(newUser);
        cb();
      }).catch(function (err) {
        console.log(err);
      });
    });
  });

  User.afterRemote('prototype.__get__submissions', function(ctx, instance, next) {
    if (ctx.processed) {
      return next();
    }
    ctx.processed = true;
    // enrich response with user information
    var result = [];

    var callback = _.after(ctx.result.length, function(err) {
      if (err) {
        logger.error(err);
      }
      ctx.result = result;
      next();
    });

    _.each(ctx.result, function(submission) {
      submission.getAllAuthors(function(err, authors) {
        if (err) {
          return callback(err);
        }
        submission = submission.toJSON();
        submission.authors = authors.map(function(a) {
          return {
            username: a.username,
            email: a.email,
            id: a.id
          }
        });
        result.push(submission);
        callback();
      })
    });
  });
};
