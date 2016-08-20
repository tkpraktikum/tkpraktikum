angular
  .module('app', [
    'lbServices',
    'ui.router',
    'permission',
    'permission.ui',
    'chart.js',
    'ui.bootstrap.showErrors',
    'ui.select',
    'ngSanitize'
  ])
  .config(["$stateProvider", "$urlRouterProvider", function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/');
    $urlRouterProvider.when('/', '/login');

    // Configuration option reference:
    // https://github.com/angular-ui/ui-router/wiki/Quick-Reference#stateconfig
    $stateProvider
      .state('app', {
        url: '/',
        abstract: true,
        views: {
          '': {
            templateUrl: 'views/layout.html',
            controller: 'LayoutController'
          },
          'header@app': {
            templateUrl: 'views/header.html',
            controller: 'HeaderController'
          },
          'footer@app': {
            templateUrl: 'views/footer.html'
          }
        }
      })
      .state('app.login', {
        url: 'login',
        templateUrl: 'views/user/login.html',
        controller: 'LoginController'
      })
      .state('app.logout', {
        url: 'logout',
        controller: 'LogoutController'
      })
      .state('app.signup', {
        url: 'signup',
        templateUrl: 'views/user/signup.html',
        controller: 'SignupController'
      })
      .state('app.about', {
        url: 'about',
        templateUrl: 'views/about.html',
      })

      // User area
      .state('app.protected', {
        template: '<div ui-view></div>',
        data: { permissions: { only: ['USER'], redirectTo: 'app.login' } }
      })
      .state('app.protected.home', {
        url: 'account',
        templateUrl: 'views/user/home.html',
        controller: 'HomeController'
      })
      .state('app.protected.user', {
        url: 'user',
        abstract: true,
        template: '<div ui-view></div>',
        data: { permissions: { only: ['USER'] }}
      })
      .state('app.protected.user.profile', {
        abstract: true,
        url: '/profile',
        templateUrl: 'views/user/profile.html',
        controller: 'ProfileController',
      })
      .state('app.protected.user.profile.edit', {
        url: '/edit',
        templateUrl: 'views/user/profile.edit.html',
      })
      .state('app.protected.user.profile.changePassword', {
        url: '/changePassword',
        templateUrl: 'views/user/profile.changePassword.html',
      })
      .state('app.protected.user.profile.delete', {
        url: '/delete',
        templateUrl: 'views/user/profile.delete.html',
      })
      .state('app.protected.user.conference', {
        url: '/conference',
        abstract: true,
        template: '<div ui-view></div>',
      })
      .state('app.protected.user.conference.join', {
        url: '/join',
        templateUrl: 'views/user/joinConference.html',
        controller: 'JoinConferenceController',
      })
      .state('app.protected.user.conference.create', {
        url: '/create',
        templateUrl: 'views/user/createConference.html',
        controller: 'CreateConferenceController',
      })
      .state('app.protected.user.conference.my', {
        url: '/my',
        templateUrl: 'views/user/myConferences.html',
        controller: 'MyConferencesController',
      })
      .state('app.protected.conference', {
        url: 'conference/:conferenceId/',
        template: '<div ui-view></div>',
        abstract: true,
        controller: 'ConferenceController'
      })
      .state('app.protected.conference.home', {
        url: 'home',
        templateUrl: 'views/user/conference.landing.html',
        controller: 'ConferenceLandingController'
      })
      .state('app.protected.conference.statistics', {
        url: 'statistics',
        templateUrl: 'views/chair/statistics.html',
        controller: 'StatisticsController'
      })
      .state('app.protected.conference.tag', {
        url: 'tag',
        templateUrl: 'views/chair/tag.html',
        controller: 'TagController'
      })
      .state('app.protected.conference.affiliation', {
        url: 'affiliation',
        templateUrl: 'views/chair/affiliation.html',
        controller: 'AffiliationController'
      })
      .state('app.protected.conference.submission', {
        url: 'submission',
        abstract: true,
        templateUrl: 'views/author/submissions.html',
        controller: 'SubmissionController',
        data: { permissions: { only: ['AUTHOR'] }}
      })
      .state('app.protected.conference.submission.list', {
        url: '/list',
        templateUrl: 'views/author/submissions.list.html',
        data: { permissions: { only: ['AUTHOR', 'CHAIR'] }}
      })
      .state('app.protected.conference.submission.create', {
        url: '/create',
        views: {
          '@app.protected': {
            controller: 'SubmissionCreateController',
            templateUrl: 'views/author/submissions.create.html'
          }
        }
      })
      .state('app.protected.conference.review', {
        abstract: true,
        url: 'review',
        template: '<div ui-view></div>',
        controller: 'ReviewController',
        data: { permissions: { only: ['REVIEWER'] }}
      })
      .state('app.protected.conference.review.list', {
        url: '/list',
        templateUrl: 'views/reviewer/reviews.list.html',
        data: { permissions: { only: ['REVIEWER', 'CHAIR'] }}
      })
      .state('app.protected.conference.review.create', {
        url: '/create',
        templateUrl: 'views/reviewer/reviews.create.html',
        controller: 'ReviewCreateController',
        data: { permissions: { only: ['REVIEWER'] }}
      })
      .state('app.protected.conference.users', {
        url: 'usermanagement',
        templateUrl: 'views/chair/userManagement.html',
        controller: 'ChairUserManagementController',
        data: { permissions: { only: ['CHAIR'] }}
      })
  }])
.factory('AuthService', ['$q', 'LoopBackAuth', 'User', function ($q, LoopBackAuth, User) {

  var user,
    currentConferenceId = null,
    flashMessage = null,
    login = function (username, password, rememberMe) {
      return user = User.login({
          username: username,
          password: password,
          rememberMe: rememberMe || false
        }).$promise.then(function (response) {
          return retrieveUserWithRoles(response.user.id);
        });
    },
    logout = function () {
      return User.logout().$promise.then(function () {
        // LoopBackAuth.clearUser();
        // LoopBackAuth.clearStorage();
        currentConferenceId = null;
        flashMessage = null;
        user = $q.reject();
      });
    },
    hasRole = function (role) {
      return user.then(
        function (user) {
          if (user[role]) {
            for (idx in user[role]) {
              if (user[role][idx].id === currentConferenceId) return $q.resolve();
            }
          }

          return $q.reject();
        },
        function () { return $q.reject(); }
      );
    },
    isAuthenticated = User.isAuthenticated.bind(User),
    retrieveUserWithRoles = function (userId) {
      var user = User.findById({
          id: userId,
          filter: {
            include: ['reviewer', 'author', 'attendee', 'chair'].map(function (role) {
              return { relation: role, scope: { fields: ['id'] }};
            })
          }
        }).$promise;

      user.then(function (model) {
        setCurrentConferenceId(model.defaultConferenceId);
      });

      return user;
    },
    getCurrentConferenceId = function () {
      return currentConferenceId;
    },
    setCurrentConferenceId = function (conferenceId) {
      if (conferenceId) {
        currentConferenceId = parseInt(conferenceId, 10);
      } else {
        currentConferenceId = null;
      }
    };

  user = isAuthenticated() ?
    retrieveUserWithRoles(LoopBackAuth.currentUserId) :
    $q.reject();

  return {
    login: login,
    logout: logout,
    hasRole: hasRole,
    getUser: function () { return user; },
    getUserId: function () { return user.then(function (user) { return user.id; }); },
    isAuthenticated: isAuthenticated,
    getCurrentConferenceId: getCurrentConferenceId,
    setCurrentConferenceId: setCurrentConferenceId,
    hasFlash: function () { return !!flashMessage; },
    getFlash: function () { var m = flashMessage; flashMessage = null; return m || ''; },
    setFlash: function (msg) { flashMessage = msg; }
  };
}])
.run(function($rootScope, $q, PermissionStore, RoleStore, AuthService) {
  PermissionStore.definePermission('hasValidSession', function () {
    return AuthService.isAuthenticated();
  });
  PermissionStore.defineManyPermissions(['chair', 'author', 'reviewer', 'attendee'],
      function (roleName, transitionProperties) {
    return AuthService.hasRole(roleName);
  });

  RoleStore.defineRole('USER', ['hasValidSession']);
  RoleStore.defineRole('CHAIR', ['hasValidSession', 'chair']);
  RoleStore.defineRole('AUTHOR', ['hasValidSession', 'author']);
  RoleStore.defineRole('REVIEWER', ['hasValidSession', 'reviewer']);
  RoleStore.defineRole('ATTENDEE', ['hasValidSession', 'attendee']);
}).config(['showErrorsConfigProvider', function(showErrorsConfigProvider) {
  showErrorsConfigProvider.showSuccess(true);
}]);
