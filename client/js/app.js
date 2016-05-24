angular
  .module('app', [
    'lbServices',
    'ui.router',
    'permission',
    'permission.ui',
    'ui.router.stateHelper',
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
  .factory("$authentication", ["$rootScope", 'ipCookie', function ($rootScope, ipCookie) {

    var cookieName = "statusLoggedIn";
    var cookieNameId = "statusUserId";

    return {

      clearAuthKey: function () {
        return ipCookie.remove(cookieName, {
          path: "/"
        });
      },

      getAuthKey: function () {
        $rootScope.loggedIn = !!(ipCookie(cookieName));
        if (ipCookie(cookieNameId)) {
          $rootScope.userId = ipCookie(cookieNameId);
        } else {
          $rootScope.userId = -1;
          $rootScope.userRoles = [];
        }
        return $rootScope.loggedIn;
      },

      setAuthKey: function (key) {
        ipCookie(cookieName, key, {
          path: "/"
        });
      }
    };
  }]).factory('loginStatusWatcher', ["$authentication", function ($authentication) {
  return {
    response: function (response) {
      $authentication.getAuthKey();
      return response;
    }
  };
}]).config(['$httpProvider', function ($httpProvider) {
  $httpProvider.interceptors.push('loginStatusWatcher');
}]).run(function($rootScope, $http, $q, PermissionStore, RoleStore) {
  $rootScope.appReady = true;
  PermissionStore.definePermission('hasValidSession', (function () {
    var promise = $q(function (resolve, reject) {
      $http({method: 'GET', url: '/auth/me'}).then(
        function (rsp) { rsp.data && rsp.data.id > 0 ? resolve() : reject(); },
        function (err) { reject(); }
      );
    });

    $rootScope.$watch('loggedIn', function (loggedIn) {
      // Unfortunately the angular promise API does not expose a status. So we
      // need to rely on the internal implementation by accessing $$state.
      // If the current promise is not resolved -> ignore state change.
      if ([1,2].indexOf(promise.$$state.status) >= 0) {
        promise = $q(function (resolve, reject) { loggedIn ? resolve() : reject() });
      }
    });

    return function () {
      return promise;
    }
  })());

  var roleChecker = (function () {
    var deferred = $q.defer(); // do not resolve until roles are ready

    $rootScope.$watch('userRoles', function (userRoles) {
      if (Object.prototype.toString.call(userRoles) === '[object Array]') {
        // Promise was already resolved, create new promise
        if ([1,2].indexOf(deferred.promise.$$state.status)) {
          deferred = $q.defer();
        }

        // Resolve pending promise
        deferred.resolve(userRoles);
      }
    });

    return function (roleName, transitionProperties) {
      return $q(function (resolve, reject) {
        deferred.promise.then(
          function (val) { val.indexOf(roleName.toLowerCase()) >= 0 ? resolve() : reject(); },
          function (err) { reject(); }
        );
      });
    }
  })();

  PermissionStore.defineManyPermissions(['chair', 'author', 'reviewer'], roleChecker);
  RoleStore.defineRole('USER', ['hasValidSession']);
  RoleStore.defineRole('CHAIR', ['hasValidSession', 'chair']);
  RoleStore.defineRole('AUTHOR', ['hasValidSession', 'author']);
  RoleStore.defineRole('REVIEWER', ['hasValidSession', 'reviewer']);

  $rootScope.$watch('userId', function (userId) {
    // get the roles of this user if the userId changes
    if (userId !== undefined && userId > 0) {
      $http({
        method: 'GET',
        url: '/api/users/' + userId + '/roles'
      }).then(function successCallback(response) {
        $rootScope.userRoles = response.data.map(function (e) {
          return e.name
        });
        console.log($rootScope.userRoles);
      }, function errorCallback(response) {
        console.log(JSON.stringify(response));
        // called asynchronously if an error occurs
        // or server returns response with an error status.
      });
    }
  });
});
