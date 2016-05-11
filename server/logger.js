var winston = require('winston');

var twoDigit = '2-digit';
var dateOptions = {
  day: twoDigit,
  month: twoDigit,
  year: twoDigit,
  hour: twoDigit,
  minute: twoDigit,
  second: twoDigit
};

var logger = new (winston.Logger)({

  transports: [
    new (winston.transports.Console)({
      timestamp: function () {
        return Date.now();
      }, formatter: function (options) {
        var dateTimeComponents = new Date().toLocaleTimeString('en-US', dateOptions).split(',');
        return winston.config.colorize(options.level, options.level.toUpperCase()) + ' ' +
          dateTimeComponents[0] + dateTimeComponents[1] + ': ' + options.message;
      }, level: 'debug', colorize: true
    })
  ]
});

module.exports = logger;
