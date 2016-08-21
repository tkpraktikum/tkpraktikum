var logger = require('./logger');

module.exports = function(app) {
  app.dataSource('postgres', {
    connector: 'memory',
    file: process.env.DB_FILE || 'db.json'
  });

  logger.info('initialized database datasource');

  app.dataSource('storage', {
    "connector": require('loopback-component-storage'),
    "provider": "filesystem",
    "root": "./storage",
    "maxFileSize": "52428800",
    getFilename: function (origFilename, req, res) {
      // Always ensure to send the accesstoken together with the POST file
      // upload via either of the following methods!
      //
      // * - `access_token` (params only)
      // * - `X-Access-Token` (headers only)
      // * - `authorization` (headers and cookies)

      var ts = (new Date()).getTime(),
        userId = req.accessToken.userId,
        newFilename = ts + '-' + userId + '_' + origFilename.name;

      return newFilename;
    }
  });

  logger.info('initialized storage datasource');
};
