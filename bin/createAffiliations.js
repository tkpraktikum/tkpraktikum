var _ = require('underscore');
var logger = require('./../server/logger');

module.exports = function(app, ds, callback) {
  var affiliations = [
    {
      name: 'TU Darmstadt',
      city: 'Darmstadt',
      state: 'Hesse',
      country: 'Germany'
    },
    {
      name: 'HS Darmstadt',
      city: 'Darmstadt',
      state: 'Hesse',
      country: 'Germany'
    },
    {
      name: 'DHBW Mannheim',
      city: 'Mannheim',
      state: 'Baden-Württemberg',
      country: 'Germany'
    },
    {
      name: 'Uni Mannheim',
      city: 'Mannheim',
      state: 'Baden-Württemberg',
      country: 'Germany'
    }
  ];

  var cb = _.after(affiliations.length, function(err) {
    callback(err);
  });

  _.each(affiliations, function(affiliation) {
    app.models.Affiliation.create(affiliation, function(err, model) {
      if (!err) {
        logger.info('Created: ' + JSON.stringify(model));
      }
      cb(err);
    });
  });
};
