var _ = require('underscore');
var logger = require('./../server/logger');

module.exports = function(app, ds, callback) {
  var conferences = [
    {
      name: 'TK Conference'
    }
  ];

  var cb = _.after(conferences.length, function(err) {
    callback(err);
  });

  _.each(conferences, function(conference) {
    app.models.Conference.create(conference, function(err, model) {
      if (!err) {
        logger.info('Created: ' + JSON.stringify(model));
      }
      cb(err);
    });
  });
};
