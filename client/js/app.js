angular
  .module('app', [
    'lbServices',
    'ui.router',
    'permission',
    'permission.ui',
    'chart.js',
    'ui.bootstrap.showErrors',
    'ui.select',
    'ngSanitize',
    'btford.markdown',
    'simplemde',
    'uiGmapgoogle-maps'
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
      .state('app.protected.user.conference.manage', {
        url: '/manage',
        template: '<div ui-view></div>',
        abstract: true
      })
      .state('app.protected.user.conference.manage.create', {
        templateUrl: 'views/user/manageConference.html',
        controller: 'CreateConferenceController',
        url: '/create',
      })
      .state('app.protected.user.conference.manage.edit', {
        templateUrl: 'views/user/manageConference.html',
        controller: 'CreateConferenceController',
        url: '/:conferenceId',
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
      .state('app.protected.conference.admin', {
        url: 'admin',
        abstract: true,
        template: '<div ui-view></div>',
        data: { permissions: { only: ['CHAIR'] }}
      })
      .state('app.protected.conference.admin.reviews', {
        url: '/reviews',
        abstract: true,
        template: '<div ui-view></div>',
        data: { permissions: { only: ['CHAIR'] }}
      })
      .state('app.protected.conference.admin.reviews.assignment', {
        url: '/assignment',
        templateUrl: 'views/chair/reviewer.assignment.html',
        controller: 'ReviewerAssignmentController',
        data: { permissions: { only: ['CHAIR'] }}
      })
      .state('app.protected.conference.admin.reviews.submissionList', {
        url: '/submission/:submissionId',
        templateUrl: 'views/shared/reviews.list.html',
        controller: 'SubmissionReviewListController',
        data: { permissions: { only: ['CHAIR'] }}
      })
      .state('app.protected.conference.admin.reviews.list', {
        url: '/reviews',
        templateUrl: 'views/shared/reviews.list.html',
        controller: 'ChairReviewListController',
        data: { permissions: { only: ['CHAIR'] }}
      })
      .state('app.protected.conference.admin.submissions', {
        url: '/submissions',
        templateUrl: 'views/chair/submissions.html',
        controller: 'SubmissionsChairController',
        data: { permissions: { only: ['CHAIR'] }}
      })
      .state('app.protected.conference.admin.submissionsDetails', {
        url: '/submissions/:submissionId',
        templateUrl: 'views/shared/submission.details.html',
        controller: 'ViewSubmissionController',
        data: { permissions: { only: ['CHAIR'] }}
      })
      .state('app.protected.conference.submission', {
        url: 'submission',
        abstract: true,
        template: '<div ui-view></div>',
        data: { permissions: { only: ['AUTHOR'] }}
      })
      .state('app.protected.conference.submission.list', {
        url: '/list',
        templateUrl: 'views/author/submissions.list.html',
        controller: 'SubmissionController',
        data: { permissions: { only: ['AUTHOR'] }}
      })
      .state('app.protected.conference.submission.reviews', {
        url: '/reviews',
        abstract: true,
        template: '<div ui-view></div>',
        data: { permissions: { only: ['AUTHOR'] }}
      })
      .state('app.protected.conference.submission.reviews.list', {
        url: '/:submissionId',
        templateUrl: 'views/shared/reviews.list.html',
        controller: 'SubmissionReviewListController',
        data: { permissions: { only: ['AUTHOR'] }}
      })
      .state('app.protected.conference.submission.create', {
        url: '/create',
        controller: 'SubmissionController',
        templateUrl: 'views/author/submissions.create.html'
      })
      .state('app.protected.conference.submission.edit', {
        url: '/edit/:submissionId',
        controller: 'SubmissionController',
        templateUrl: 'views/author/submissions.create.html'
      })
      .state('app.protected.conference.review', {
        abstract: true,
        url: 'review',
        template: '<div ui-view></div>',
        controller: 'ReviewController',
        data: { permissions: { only: ['REVIEWER'] }}
      })
      .state('app.protected.conference.review.submission', {
        url: '/submission/:submissionId',
        templateUrl: 'views/shared/submission.details.html',
        controller: 'ViewSubmissionController',
        data: { permissions: { only: ['REVIEWER'] }}
      })
      .state('app.protected.conference.review.overview', {
        url: '/overview',
        templateUrl: 'views/reviewer/reviews.overview.html',
        controller: 'ReviewOverviewController',
        data: { permissions: { only: ['REVIEWER'] }}
      })
      .state('app.protected.conference.review.list', {
        url: '/list',
        templateUrl: 'views/shared/reviews.list.html',
        controller: 'ReviewListController',
        data: { permissions: { only: ['REVIEWER', 'CHAIR'] }}
      })
      .state('app.protected.conference.review.edit', {
        url: '/edit/:reviewId',
        templateUrl: 'views/reviewer/reviews.edit.html',
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
.factory('AuthService', ['$q', 'LoopBackAuth', 'User', 'Conference', function ($q, LoopBackAuth, User, Conference) {
  var user,
    currentConference = null,
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
    refreshConferenceInfo = function() {
      if (currentConferenceId) {
        Conference.findById({id: currentConferenceId}).$promise.then(function (c) {
          currentConference = c;
        });
      }
    },
    getCurrentConferenceId = function () {
      return currentConferenceId;
    },
    setCurrentConferenceId = function (conferenceId) {
      if (conferenceId) {
        currentConferenceId = parseInt(conferenceId, 10);
        refreshConferenceInfo();
      } else {
        currentConferenceId = null;
      }
    }, isSubmissionPhase = function() {
      return  (currentConference &&
        (currentConference.forceSubmission || (new Date(currentConference.submissionDeadline)).getTime() > Date.now()));
    }, isReviewPhase = function() {
      return  (currentConference &&
      (currentConference.forceReview || (new Date(currentConference.reviewDeadline)).getTime() > Date.now())
      && (currentConference.forceSubmission || (new Date(currentConference.submissionDeadline)).getTime() < Date.now()));
    }, reviewsDone = function() {
      return  (currentConference &&
      (currentConference.forceReview || (new Date(currentConference.reviewDeadline)).getTime() < Date.now()));
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
    getAccessTokenId: function () { return LoopBackAuth.accessTokenId; },
    isAuthenticated: isAuthenticated,
    getCurrentConferenceId: getCurrentConferenceId,
    setCurrentConferenceId: setCurrentConferenceId,
    hasFlash: function () { return !!flashMessage; },
    getFlash: function () { var m = flashMessage; flashMessage = null; return m || ''; },
    setFlash: function (msg) { flashMessage = msg; },
    isSubmissionPhase: isSubmissionPhase,
    isReviewPhase: isReviewPhase,
    reviewsDone: reviewsDone
  };
}])
// https://gist.github.com/thomseddon/3511330
.filter('bytes', function() {
  return function(bytes, precision) {
    if (isNaN(parseFloat(bytes)) || !isFinite(bytes)) return '-';
    if (typeof precision === 'undefined') precision = 1;
    var units = ['bytes', 'kB', 'MB', 'GB', 'TB', 'PB'],
      number = Math.floor(Math.log(bytes) / Math.log(1024));
    return (bytes / Math.pow(1024, Math.floor(number))).toFixed(precision) +  ' ' + units[number];
  }
})
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
}]).config(['markdownConverterProvider', function (markdownConverterProvider) {
  // options to be passed to Showdown
  // see: https://github.com/coreyti/showdown#extensions
  markdownConverterProvider.config({
    extensions: []
  });
}]).config(function(uiGmapGoogleMapApiProvider) {
  uiGmapGoogleMapApiProvider.configure({
    key: 'AIzaSyA3SaBcz7amu_EeQekF4QHmixkf71tFyrE',
    v: '3',
    libraries: 'weather,geometry,visualization'
  });
});
