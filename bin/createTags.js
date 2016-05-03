var _ = require('underscore');

module.exports = function(app, ds, callback) {
  var tags = [
    {
      'name': 'Computer Science'
    },
    {
      'name': 'Network'
    },
    {
      'name': 'Security'
    },
    {
      'name': 'Machine Learning'
    },
    {
      'name': 'Big Data'
    },
    {
      'name': 'Testing'
    },
    {
      'name': 'Software Engineering'
    },
    {
      'name': 'Software Architecture'
    }
  ];

  var cb = _.after(tags.length, function() {
    callback();
  });

  _.each(tags, function(tag) {
    app.models.Tag.create(tag, function(err, model) {
      if (err) throw err;
      console.log('Created: ' + JSON.stringify(model));
      cb();
    });
  });
};
