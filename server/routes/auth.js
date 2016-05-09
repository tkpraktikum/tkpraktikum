//TODO improve like https://github.com/scotch-io/easy-node-authentication

var ensureLoggedIn = function ensureLoggedIn(options) {
  if (typeof options === 'string') {
    options = { redirectTo: options };
  }
  options = options || {};

  var url = options.redirectTo || '/login';
  var setReturnTo = (options.setReturnTo === undefined) ? true : options.setReturnTo;

  return function(req, res, next) {
    if (!req.isAuthenticated || !req.isAuthenticated()) {
      if (setReturnTo && req.session) {
        req.session.returnTo = req.originalUrl || req.url;
      }
      return res.redirect(url);
    } else {
      next();
    }
  };
};
var logger = require('./../logger');
var router = require('express').Router();
module.exports = router;

router.post('/signup', function(req, res) {
  var User = req.app.models.user;

  var newUser = {
    email: req.body.email.toLowerCase(),
    username: req.body.username.toLowerCase(),
    password: req.body.password,
    emailVerified: true
  };

  logger.debug('create user ', {email: newUser.email , username: newUser.username});

  User.create(newUser, function(err, user) {
    if(err) {
      req.flash('error', err.message);
      logger.warn('could not create user: ', err.message);
      return res.redirect('back');
    } else {
      logger.info('user', newUser.username, 'has been created');
      // Passport exposes a login() function on req (also aliased as logIn())
      // that can be used to establish a login session. This function is
      // primarily used when users sign up, during which req.login() can
      // be invoked to log in the newly registered user.
      req.login(user, function (err) {
        if (err) {
          logger.warn('cloud not login user:', user.username, err.message);
          req.flash('error', err.message);
          return res.redirect('back');
        }
        return res.redirect('/auth/check');
      });
    }
  });
});

router.get('/check', ensureLoggedIn('/#/signup'), function(req, res) {
  logger.info('user', req.user.username, 'is logged in');
  res.redirect('/#/account');
});

router.get('/logout', ensureLoggedIn('/#/signup'), function (req, res, next) {
  logger.info('user', req.user.username, 'is logged out');
  req.logOut();
  req.session.destroy(function (err) {
    res.redirect('/#/tag'); //Inside a callback… bulletproof!
  });
});

router.get('/me', ensureLoggedIn('/#/signup'), function (req, res, next) {
  res.end(JSON.stringify(req.user));
});

