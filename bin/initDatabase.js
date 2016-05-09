require('events').EventEmitter.prototype._maxListeners = 100;
var path = require('path');
var _ = require('underscore');
var logger = require('./../server/logger');

var createTags = require('./createTags.js');
var createConferences = require('./createConferences.js');
var createAffiliations = require('./createAffiliations.js');
var createRoles = require('./createRoles.js');
var createUser = require('./createUser.js');

var app = require(path.resolve(__dirname, '../server/server'));
var ds = app.datasources.Postgres;
ds.automigrate(undefined, function(err) {
  if (err) throw err;
  logger.info('created database schema');

  var createFunctions = [createTags, createAffiliations, createConferences, createRoles];

  var cb = _.after(createFunctions.length, function() {
    // once roles do exist, we can create the user
    createUser(app, ds, function(err) {
      ds.disconnect();
      if (err) {
        throw err;
      }
    });
  });

  _.each(createFunctions, function(fn) {
    fn(app, ds, cb);
  });
});
