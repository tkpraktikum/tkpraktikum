var _ = require('underscore');
var logger = require('winston');

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

  app.models.Tag.create(tags, function(err) {
    if (!err) {
      logger.info('Created tags');  
    }
    callback(err);
  });
};
