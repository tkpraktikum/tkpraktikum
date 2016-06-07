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
    role.principals.create({principalType: RoleMapping.USER, principalId: this.id}, function (err, principal) {
      if (!err) {
        logger.info('Created :', principal);
      }
      callback(err);
    });
  };

  User.prototype.getRoles = function(callback) {
    this
      .roles({id: this.id})
      .then(function (roles) {
        callback(null, roles);
      }, function (err) {
        logger.error(err);
        callback(err);
      });
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
      user.getRoles(function(err, roles) {
        user = user.toJSON();
        user.roles = roles.map(function(r) {return r.name;});
        result.push(user);
        cb();
      })
    });
  });

  User.afterRemote('prototype.__get__submissions', function(ctx, instance, next) {
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
