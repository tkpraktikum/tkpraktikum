var logger = require('winston');

module.exports = function(app, ds, callback) {
  var affiliations = [
    {
      name: 'TU Darmstadt',
      city: 'Darmstadt',
      state: 'Hessen',
      country: 'Germany'
    },
    {
      name: 'HS Darmstadt',
      city: 'Darmstadt',
      state: 'Hessen',
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


  app.models.Affiliation.create(affiliations, function(err) {
    if (!err) {
      logger.info('Created affiliations');
    }
    callback(err);
  });
};
