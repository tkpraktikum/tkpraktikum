var path = require('path');
var _ = require('underscore');

var createTags = require('./createTags.js');
var createConferences = require('./createConferences.js');
var createAffiliations = require('./createAffiliations.js');

var app = require(path.resolve(__dirname, '../server/server'));
var ds = app.datasources.Postgres;
ds.automigrate(undefined, function(err) {
  if (err) throw err;
  console.log('Schema created');

  var createFunctions = [createTags, createAffiliations, createConferences];

  var cb = _.after(createFunctions.length, function() {
    ds.disconnect();
  });

  _.each(createFunctions, function(fn) {
    fn(app, ds, cb);
  });
});
