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
    "maxFileSize": "52428800"
  });

  logger.info('initialized storage datasource');
};
