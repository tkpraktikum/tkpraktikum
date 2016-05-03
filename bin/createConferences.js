var _ = require('underscore');

module.exports = function(app, ds, callback) {
  var conferences = [
    {
      name: 'TK Conference'
    }
  ];

  var cb = _.after(conferences.length, function() {
    callback();
  });

  _.each(conferences, function(conference) {
    app.models.Conference.create(conference, function(err, model) {
      if (err) throw err;
      console.log('Created: ' + JSON.stringify(model));
      cb();
    });
  });
};
