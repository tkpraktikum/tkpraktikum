var path = require('path');
var async = require('async');
var logger = require('./../server/logger');
var fs = require('fs');

try {
  fs.unlinkSync(process.env.DB_FILE || './db.json');
  logger.info("removed db.json");
} catch(err) {
  logger.info("db.json does not exists");
}

fs.createReadStream('db.default.json').pipe(fs.createWriteStream('db.json'));
