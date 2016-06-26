angular
  .module('app', [
    'lbServices',
    'ui.router',
    'permission',
    'permission.ui',
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
      .state('app.protected.tag', {
        url: 'tag',
        templateUrl: 'views/tag.html',
        controller: 'TagController'
      })
      .state('app.protected.affiliation', {
        url: 'affiliation',
        templateUrl: 'views/affiliation.html',
        controller: 'AffiliationController'
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
      .state('app.protected.submission', {
        url: 'submission',
        templateUrl: 'views/main/submissions.html',
        controller: 'SubmissionController',
        data: { permissions: { only: ['AUTHOR'] }}
      })
      .state('app.protected.submission.list', {
        templateUrl: 'views/main/submissions.list.html',
        data: { permissions: { only: ['AUTHOR', 'CHAIR'] }}
      })
      .state('app.protected.submission.create', {
        url: '/create',
        views: {
          '@app.protected': {
            controller: 'SubmissionCreateController',
            templateUrl: 'views/main/submissions.create.html',
          }
        },
      })
      .state('app.protected.review', {
        url: 'review',
        templateUrl: 'views/main/reviews.html',
        controller: 'ReviewController',
        data: { permissions: { only: ['REVIEWER'] }}
      })
      .state('app.protected.review.list', {
        templateUrl: 'views/main/reviews.list.html',
        data: { permissions: { only: ['REVIEWER', 'CHAIR'] }}
      })
      .state('app.protected.review.create', {
        templateUrl: 'views/main/reviews.create.html',
        data: { permissions: { only: ['REVIEWER'] }}
      })
      .state('app.protected.chair', {
        url: 'chair',
        templateUrl: 'views/admin/chair.html',
        controller: 'ChairController',
        data: { permissions: { only: ['CHAIR'] }}
      })
      .state('app.protected.settings', {
        url: 'settings',
        templateUrl: 'views/admin/settings.html',
        controller: 'SettingsController',
        data: { permissions: { only: ['CHAIR'] }}
      })
      .state('app.protected.statistics', {
        url: 'statistics',
        templateUrl: 'views/admin/statistics.html',
        controller: 'StatisticsController',
        data: { permissions: { only: ['CHAIR'] }}
      })
      .state('app.protected.users', {
        url: 'users',
        templateUrl: 'views/account/users.list.html',
        controller: 'UserController',
        data: { permissions: { only: ['CHAIR'] }}
      })

  }])
.factory('AuthService', ['$q', 'LoopBackAuth', 'User', function ($q, LoopBackAuth, User) {
  var user,
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
      return user.then(
        function (user) { return user.roles.indexOf(role) !== -1 },
        function () { return false; }
      );
    },
    isAuthenticated = User.isAuthenticated.bind(User),
    rejectedPromise = function () {
      return $q.defer(function (resolve, reject) { reject(); }).promise;
    },
    retrieveUserWithRoles = function (userId) {
      return User.findById({id: userId, filter: {include: 'roles'}})
        .$promise.then(function (response) {
          response.roles = response.roles.map(function (element) {
            return element.name;
          });
          return response;
        });
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
