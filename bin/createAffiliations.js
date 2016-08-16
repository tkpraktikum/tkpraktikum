var logger = require('winston');
var affiliations = require('./universities.json');

module.exports = function(app, ds, callback) {

  app.models.Affiliation.create(affiliations, function(err) {
    if (!err) {
      logger.info('Created affiliations');
    }
    callback(err);
  });
};
