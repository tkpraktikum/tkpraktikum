angular
  .module('app', [
    'lbServices',
    'ui.router',
    'permission',
    'permission.ui'
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
          },
          'header@app': {
            templateUrl: 'views/common/header.html',
            controller: 'HeaderController'
          },
          'footer@app': {
            templateUrl: 'views/common/footer.html',
            controller: 'FooterController'
          }
        }
      })
      .state('app.login', {
        url: 'login',
        templateUrl: 'views/account/login.html',
        controller: 'LoginController'
      })
      .state('app.logout', {
        url: 'logout',
        controller: 'LogoutController'
      })
      .state('app.signup', {
        url: 'signup',
        templateUrl: 'views/account/signup.html',
        controller: 'SignupController'
      })
      .state('app.about', {
        url: 'about',
        templateUrl: 'views/common/about.html',
      })

      // User area
      .state('app.protected', {
        template: '<div ui-view></div>',
        data: { permissions: { only: ['USER'], redirectTo: 'app.login' } }
      })
      .state('app.protected.account', {
        url: 'account',
        templateUrl: 'views/account/account.html',
        controller: 'AccountController'
      })
      .state('app.protected.user', {
        url: 'profile',
        templateUrl: 'views/account/user.html',
        controller: 'UserController',
        data: { permissions: { only: ['USER'] }}
      })
      .state('app.protected.conferenceManagement', {
        url: 'conference/management',
        templateUrl: 'views/account/conferenceManagement.html',
        controller: 'ConferenceManagementController',
        data: { permissions: { only: ['USER'] }}
      })
      .state('app.protected.conference', {
        url: ':conferenceId/',
        template: '<div ui-view></div>',
        abstract: true,
        controller: 'ConferenceController'
      })
      .state('app.protected.conference.tag', {
        url: 'tag',
        templateUrl: 'views/tag.html',
        controller: 'TagController'
      })
      .state('app.protected.conference.affiliation', {
        url: 'affiliation',
        templateUrl: 'views/affiliation.html',
        controller: 'AffiliationController'
      })
      .state('app.protected.conference.submission', {
        url: 'submission',
        abstract: true,
        templateUrl: 'views/main/submissions.html',
        controller: 'SubmissionController',
        data: { permissions: { only: ['AUTHOR'] }}
      })
      .state('app.protected.conference.submission.list', {
        url: '/list',
        templateUrl: 'views/main/submissions.list.html',
        data: { permissions: { only: ['AUTHOR', 'CHAIR'] }}
      })
      .state('app.protected.conference.submission.create', {
        url: '/create',
        templateUrl: 'views/main/submissions.create.html',
        data: { permissions: { only: ['AUTHOR'] }}
      })
      .state('app.protected.conference.review', {
        abstract: true,
        url: 'review',
        templateUrl: 'views/main/reviews.html',
        controller: 'ReviewController',
        data: { permissions: { only: ['REVIEWER'] }}
      })
      .state('app.protected.conference.review.list', {
        url: '/list',
        templateUrl: 'views/main/reviews.list.html',
        data: { permissions: { only: ['REVIEWER', 'CHAIR'] }}
      })
      .state('app.protected.conference.review.create', {
        url: '/create',
        templateUrl: 'views/main/reviews.create.html',
        data: { permissions: { only: ['REVIEWER'] }}
      })
      .state('app.protected.conference.chair', {
        url: 'chair',
        templateUrl: 'views/admin/chair.html',
        controller: 'ChairController',
        data: { permissions: { only: ['CHAIR'] }}
      })
      .state('app.protected.conference.settings', {
        url: 'settings',
        templateUrl: 'views/admin/settings.html',
        controller: 'SettingsController',
        data: { permissions: { only: ['CHAIR'] }}
      })
      .state('app.protected.conference.statistics', {
        url: 'statistics',
        templateUrl: 'views/admin/statistics.html',
        controller: 'StatisticsController',
        data: { permissions: { only: ['CHAIR'] }}
      })
      .state('app.protected.conference.users', {
        url: 'users',
        templateUrl: 'views/account/users.list.html',
        controller: 'UserListController',
        data: { permissions: { only: ['CHAIR'] }}
      })

  }])
.factory('AuthService', ['$q', 'LoopBackAuth', 'User', '$stateParams', function ($q, LoopBackAuth, User, $stateParams) {
  var user,
    rolesCache = {},
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
        user = rejectedPromise();
      });
    },
    hasRole = function (role) {
      return rolesCache[role].then(function(c) { return c.indexOf($stateParams.conferenceId) !== -1; });
    },
    isAuthenticated = User.isAuthenticated.bind(User),
    rejectedPromise = function () {
      return $q.defer(function (resolve, reject) { reject(); }).promise;
    },
    retrieveUserWithRoles = function (userId) {
      rolesCache.attendee = User.attendee({id: userId}).$promise.then(function(conferences) {
         return conferences.map(function(c) { return c.id});
      });
      rolesCache.chair = User.chair({id: userId}).$promise.then(function(conferences) {
        return conferences.map(function(c) { return c.id});
      });
      rolesCache.reviewer = User.reviewer({id: userId}).$promise.then(function(conferences) {
         return conferences.map(function(c) { return c.id});
      });
      rolesCache.author = User.author({id: userId}).$promise.then(function(conferences) {
         return conferences.map(function(c) { return c.id});
      });
      return User.findById({id: userId}).$promise;
    };

  user = isAuthenticated() ?
    retrieveUserWithRoles(LoopBackAuth.currentUserId) :
    rejectedPromise();

  return {
    login: login,
    logout: logout,
    hasRole: hasRole,
    getUser: function () { return user; },
    isAuthenticated: isAuthenticated
  };
}])
.run(function($rootScope, $q, PermissionStore, RoleStore, AuthService) {
  PermissionStore.definePermission('hasValidSession', function () {
    return AuthService.isAuthenticated();
  });
  PermissionStore.defineManyPermissions(['chair', 'author', 'reviewer'],
      function (roleName, transitionProperties) {
    return AuthService.hasRole(roleName);
  });

  RoleStore.defineRole('USER', ['hasValidSession']);
  RoleStore.defineRole('CHAIR', ['hasValidSession', 'chair']);
  RoleStore.defineRole('AUTHOR', ['hasValidSession', 'author']);
  RoleStore.defineRole('REVIEWER', ['hasValidSession', 'reviewer']);
});
