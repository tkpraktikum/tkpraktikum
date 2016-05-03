'use strict';

var env = process.env;
var host = env.POSTGRES_HOST || "postgres";
var port = env.POSTGRES_PORT || 5432;
var db = env.POSTGRES_DB || "tk";
var user = env.POSTGRES_USER || "postgres";
var password = env.POSTGRES_PASSWORD || "root";


module.exports = {
  "postgres": {
    "host": host,
    "port": port,
    "database": db,
    "password": password,
    "name": "postgres",
    "user": user,
    "connector": "postgresql"
  }
};
