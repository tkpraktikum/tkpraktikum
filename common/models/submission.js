var async = require('async');
var _ = require('underscore');

module.exports = function(Submission) {

  Submission.prototype.getAllAuthors = function(callback) {
    this.authors({id: this.id})
      .then(function (authors) {
        callback(null, authors);
      }, function(err) {
        logger.error(err);
        callback(err);
      });
  };

  Submission.afterRemote('find', function(ctx, instance, next) {
    var userId = (ctx.req.accessToken) ? ctx.req.accessToken.userId : -1;
    var loadAuthorsFns = instance.map(function(s) {
      return function(callback) {
        s.getAllAuthors(function(err, authors) {
          if (err) {
            callback(err);
          } else {
            authors = authors.map(function(a) {
              return a.id;
            });
            if (authors.indexOf(userId) !== -1) {
              callback(null, s);
            } else {
              callback(null, null);
            }
          }
        })
      }
    });
    async.parallel(loadAuthorsFns, function(err, result) {
      if (err) {
        next(err);
      } else {
        ctx.result = result.filter(function(e) { return !!e;});
        next();
      }
    });
  });
};
