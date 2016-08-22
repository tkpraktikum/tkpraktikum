var _ = require('underscore');
var async = require('async');
var logger = require('./../../server/logger');

// see https://docs.strongloop.com/display/public/LB/Accessing+related+models
module.exports = function(User) {
  User.observe('loaded', function (ctx, next) {
    var firstname = ctx.instance && ctx.instance.firstname ||
        ctx.data && ctx.data.firstname || 'Unknown',
      lastname = ctx.instance && ctx.instance.lastname ||
        ctx.data && ctx.data.lastname || '';

    if (ctx.instance) {
      ctx.instance.fullName = firstname + ' ' + lastname
    } else {
      ctx.data.fullName = firstname + ' ' + lastname;
    }
    next();
  });

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
};
