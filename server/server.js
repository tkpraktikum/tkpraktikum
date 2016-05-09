var loopback = require('loopback');
var boot = require('loopback-boot');
var routes = require('./routes/routes');
var app = module.exports = loopback();
var logger = require('./logger');

// Passport configurators..
var loopbackPassport = require('loopback-component-passport');
var PassportConfigurator = loopbackPassport.PassportConfigurator;
var passportConfigurator = new PassportConfigurator(app);

/*
 * body-parser is a piece of express middleware that
 *   reads a form's input and stores it as a javascript
 *   object accessible through `req.body`
 *
 */
var bodyParser = require('body-parser');

/**
 * Flash messages for passport
 *
 * Setting the failureFlash option to true instructs Passport to flash an
 * error message using the message given by the strategy's verify callback,
 * if any. This is often the best approach, because the verify callback
 * can make the most accurate determination of why authentication failed.
 */
var flash = require('express-flash');

// attempt to build the providers/passport config
var config = {};
try {
  config = require('../providers.local.json');
} catch (err) {
  try {
    config = require('../providers.json');
  } catch (err) {
    logger.error(err);
    process.exit(1); // fatal
  }
}

// -- Add your pre-processing middleware here --

// boot scripts mount components like REST API
boot(app, __dirname);

// to support JSON-encoded bodies
app.middleware('parse', bodyParser.json());
// to support URL-encoded bodies
app.middleware('parse', bodyParser.urlencoded({
  extended: true
}));

// The access token is only available after boot
app.middleware('auth', loopback.token({
  model: app.models.accessToken
}));

app.middleware('session:before', loopback.cookieParser(app.get('cookieSecret')));
app.middleware('session', loopback.session({
  secret: 'kitty',
  saveUninitialized: true,
  resave: true
}));
passportConfigurator.init();

// We need flash messages to see passport errors
app.use(flash());

passportConfigurator.setupModels({
  userModel: app.models.user,
  userIdentityModel: app.models.userIdentity,
  userCredentialModel: app.models.userCredential
});
for (var s in config) {
  var c = config[s];
  c.session = c.session !== false;
  //c.setAccessToken = true; // todo : doesn't solve the issue that local users miss access tokens
  passportConfigurator.configureProvider(s, c);
}
var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;

app.use('/auth', routes.auth);

app.use(function(req, res, next) {
  var result = {
    loggedIn: req.isAuthenticated(),
    userId: -1
  };
  if (result.loggedIn) {
    result.userId = req.user.toJSON().id;
  }
  res.cookie('statusLoggedIn', result.loggedIn, {path: '/', maxAge: 90000000, httpOnly: false});
  res.cookie('statusUserId', result.userId, {path: '/', maxAge: 90000000, httpOnly: false});
  // todo for some reasons we need to correct the auth token
  if (result.loggedIn && (req.accessToken === null || req.accessToken.toJSON().userId !== result.userId)) {
    // accessToken is not set for local users.. //TODO can we solve this somehwere else?
    req.user.createAccessToken(3600, function(error, token) {
      if(error) {
        throw error;
      } else {
        req.accessToken = token;
        next();
      }
    });
  } else {
    next();
  }
});

app.start = function() {
  // start the web server
  return app.listen(function() {
    app.emit('started');
    var baseUrl = app.get('url').replace(/\/$/, '');
    logger.info('Web server listening at: %s', baseUrl);
    if (app.get('loopback-component-explorer')) {
      var explorerPath = app.get('loopback-component-explorer').mountPath;
      logger.info('Browse your REST API at %s%s', baseUrl, explorerPath);
    }
  });
};

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, function(err) {
  if (err) throw err;

  // start the server if `$ node server.js`
  if (require.main === module)
    app.start();
});
