angular
  .module('app', [
    'lbServices',
    'ui.router',
    'permission',
    'permission.ui',
    'ipCookie'
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
        template: '<ui-view/>'
      })
      .state('app.login', {
        url: 'login',
        templateUrl: 'views/login.html',
        controller: 'LoginController'
      })
      .state('app.signup', {
        url: 'signup',
        templateUrl: 'views/signup.html',
        controller: 'SignupController'
      })

      // User area
      .state('app.protected', {
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
        templateUrl: 'views/account.html',
        controller: 'AccountController'
      })
      .state('app.protected.submission', {
        url: 'submission',
        templateUrl: 'views/submissions.html',
        controller: 'SubmissionController'
      })
      .state('app.protected.submission.list', {
        templateUrl: 'views/submissions.list.html'
      })
      .state('app.protected.chair', {
        url: 'chair',
        templateUrl: 'views/chair.html',
        controller: 'ChairController',
        data: { permissions: { only: ['CHAIR'] }}
      });
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
    isAuthenticated: isAuthenticated
  };
}])
.run(function($rootScope, $q, PermissionStore, RoleStore, AuthService) {
  PermissionStore.definePermission('hasValidSession', function () {
    console.log("ASK FOR VALID SESSION");
    return AuthService.isAuthenticated();
  });
  PermissionStore.defineManyPermissions(['chair', 'author', 'reviewer'],
      function (roleName, transitionProperties) {
    console.log("ASK FOR PERMISSION");
    return AuthService.hasRole(roleName);
  });

  RoleStore.defineRole('USER', ['hasValidSession']);
  RoleStore.defineRole('CHAIR', ['hasValidSession', 'chair']);
  RoleStore.defineRole('AUTHOR', ['hasValidSession', 'author']);
  RoleStore.defineRole('REVIEWER', ['hasValidSession', 'reviewer']);
});
