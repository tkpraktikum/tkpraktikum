angular
  .module('app', [
    'lbServices',
    'ui.router',
    'ui.router.stateHelper',
    'ui.router.login'
  ])
  .config(["stateHelperProvider", "$urlRouterProvider", function (stateHelperProvider, $urlRouterProvider) {

    stateHelperProvider
      .state({
        name: "app",
        abstract: true,
        url: "/",
        template: '<ui-view />',
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
            requireLogin: true
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
            controller: 'ChairController'
          }]
        }]
      });
    $urlRouterProvider.otherwise('tag');
  }])
  .config(function ($loginProvider) {
    $loginProvider
      .setDefaultLoggedInState("app.private.account")
      .setFallbackState("app.public.login")
      .setAuthModule("$authentication")
      .setAuthClearMethod("clearAuthKey")
      .setAuthGetMethod("getAuthKey")
      .setCookieName("__loginState");

  })
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
}]).run(function($rootScope, $http) {
  $rootScope.checkRole = function(role) {
    return $rootScope.userRoles && $rootScope.userRoles.indexOf(role) !== -1;
  };
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
