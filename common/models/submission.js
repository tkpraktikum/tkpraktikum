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
};
