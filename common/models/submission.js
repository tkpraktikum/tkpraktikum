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

  Submission.prototype.testRemote = function(msg, par1, cb) {
    console.log("CALL FOR testRemote", msg, par1, cb);
    cb(null, "haha");
  };

  // Create with embedded relations
  Submission.beforeRemote('create', {
    isStatic: false,
    accepts: [
      { arg: 'submission', type: 'string' },
    ],
    returns: { arg: 'greeting', type: 'string' }
  });

  Submission.beforeRemote('create', function (ctx, unused, next) {
    console.log("BEFORE REMOTE", ctx.req.body);
    // Tag.upsert(ctx.req.body.tags)
    next();
  });
};
