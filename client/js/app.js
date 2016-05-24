angular
  .module('app', [
    'lbServices',
    'ui.router',
    'permission',
    'permission.ui',
    'ui.router.stateHelper',
    'ipCookie'
  ])
  .config(["stateHelperProvider", "$urlRouterProvider", function (stateHelperProvider, $urlRouterProvider) {
    stateHelperProvider
      .state({
        name: "app",
        abstract: true,
        url: "/",
        templateUrl: 'views/layout.html',
        children: [{
          name: "public",
          template: '<ui-view />',
          abstract: true,
          children: [{
            name: 'login',
            url: 'login',
            templateUrl: 'views/login.html',
            controller: 'LoginController'
          }, {
            name: 'logout',
            url: 'logout',
            controller: 'LogoutController'
          }, {
            name: 'signup',
            url: 'signup',
            templateUrl: 'views/signup.html',
            controller: 'SignupController'
          }]
        }, {
          name: "private",
          template: '<ui-view />',
          abstract: true,
          data: {
            permissions: {
              only: ['USER']
              //redirectTo: 'login'
            }
          },
          children: [{
            name: 'tag',
            url: 'tag',
            templateUrl: 'views/tag.html',
            controller: 'TagController'
          }, {
            name: 'affiliation',
            url: 'affiliation',
            templateUrl: 'views/affiliation.html',
            controller: 'AffiliationController'
          }, {
            name: 'account',
            url: 'account',
            templateUrl: 'views/account.html',
            controller: 'AccountController'
          }, {
            name: 'submission',
            url: 'submission',
            templateUrl: 'views/submissions.html',
            controller: 'SubmissionController',
            abstract: true,
            children: [
              {
                name: 'list',
                url: '',
                templateUrl: 'views/submissions.list.html'
              }
            ]
          }, {
            name: 'chair',
            url: 'chair',
            templateUrl: 'views/chair.html',
            controller: 'ChairController',
            data: {
              permissions: {
                only: ['CHAIR']
              }
            }
          }]
        }]
      });
    $urlRouterProvider.otherwise('tag');
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
