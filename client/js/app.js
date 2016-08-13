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
            templateUrl: 'views/layout.html'
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
        url: '/profile',
        templateUrl: 'views/user/user.html',
        controller: 'ProfileController',
        data: { permissions: { only: ['USER'] }}
      })
      .state('app.protected.user.conference', {
        url: '/conference',
        abstract: true,
        template: '<div ui-view></div>',
        data: { permissions: { only: ['USER'] }}
      })
      .state('app.protected.user.conference.join', {
        url: '/join',
        templateUrl: 'views/user/joinConference.html',
        controller: 'JoinConferenceController',
        data: { permissions: { only: ['USER'] }}
      })
      .state('app.protected.user.conference.create', {
        url: '/create',
        templateUrl: 'views/user/createConference.html',
        controller: 'CreateConferenceController',
        data: { permissions: { only: ['USER'] }}
      })
      .state('app.protected.user.conference.my', {
        url: '/my',
        templateUrl: 'views/user/myConferences.html',
        controller: 'MyConferencesController',
        data: { permissions: { only: ['USER'] }}
      })
      .state('app.protected.conference', {
        url: 'conference/:conferenceId/',
        template: '<div ui-view></div>',
        abstract: true,
        controller: 'ConferenceController'
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
        templateUrl: 'views/author/submissions.create.html',
        data: { permissions: { only: ['AUTHOR'] }}
      })
      .state('app.protected.conference.review', {
        abstract: true,
        url: 'review',
        templateUrl: 'views/reviewer/reviews.html',
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
        data: { permissions: { only: ['REVIEWER'] }}
      })
      .state('app.protected.conference.users', {
        url: 'usermanagement',
        templateUrl: 'views/chair/userManagement.html',
        controller: 'ChairUserManagementController',
        data: { permissions: { only: ['CHAIR'] }}
      })
  }])
.factory('AuthService', ['$q', '$rootScope', 'LoopBackAuth', 'User', '$stateParams',
    function ($q, $rootScope, LoopBackAuth, User, $stateParams) {

  $rootScope.currentConferenceId = window.localStorage.getItem('currentConference');

  var user,
    rolesCache = {},
    login = function (username, password, rememberMe) {
      return user = User.login({
          username: username,
          password: password,
          rememberMe: rememberMe || false
        }).$promise.then(function (response) {
          window.localStorage.setItem('currentConference', response.user.defaultConferenceId);
          $rootScope.currentConferenceId = response.user.defaultConferenceId;
          return retrieveUserWithRoles(response.user.id);
        });
    },
    logout = function () {
      return User.logout().$promise.then(function () {
        // LoopBackAuth.clearUser();
        // LoopBackAuth.clearStorage();
        window.localStorage.removeItem('currentConference');
        user = rejectedPromise();
      });
    },
    hasRole = function (role) {
      if (rolesCache[role]) {
        return rolesCache[role].then(function (c) {
          if(c.indexOf(parseInt(window.localStorage.getItem('currentConference'), 10)) !== -1) {
            return $q.resolve();
          } else {
            return $q.reject();
          }
        });
      } else {
        return $q.resolve(false);
      }
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
    $q.reject();

  return {
    login: login,
    logout: logout,
    hasRole: hasRole,
    getUser: user,
    getUserId: user.then(function (user) { return user.id; }),
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
