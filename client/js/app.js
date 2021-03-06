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
    'uiGmapgoogle-maps',
    'angularUtils.directives.uiBreadcrumbs'
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
        },
        data: { breadcrumbProxy: 'app.login' }
      })
      .state('app.login', {
        url: 'login',
        templateUrl: 'views/user/login.html',
        controller: 'LoginController',
        data: {
          permissions: { except: ['hasValidSession'], redirectTo: 'app.logout' },
          displayName: 'Start'
        }
      })
      .state('app.logout', {
        url: 'logout',
        controller: 'LogoutController',
        data: { displayName: 'Logout' }
      })
      .state('app.signup', {
        url: 'signup',
        templateUrl: 'views/user/signup.html',
        controller: 'SignupController',
        data: { displayName: 'Create Account' }
      })
      .state('app.about', {
        url: 'about',
        templateUrl: 'views/about.html',
        data: { displayName: 'About' }
      })

      // User area
      .state('app.protected', {
        abstract: true,
        template: '<div ui-view></div>',
        data: {
          permissions: { only: ['USER'], redirectTo: 'app.login' },
          breadcrumbProxy: 'app.protected.home'
        },
        resolve: { u: function (AuthService) {
          return AuthService.getUser().then(function (user) { return user; });
        }}
      })
      .state('app.protected.home', {
        url: 'account',
        templateUrl: 'views/user/home.html',
        controller: 'HomeController',
        data: { displayName: '{{ u.fullName }}' }
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
        controller: 'ProfileController'
      })
      .state('app.protected.user.profile.edit', {
        url: '/edit',
        templateUrl: 'views/user/profile.edit.html',
        data: { displayName: 'Edit Profile' }
      })
      .state('app.protected.user.profile.changePassword', {
        url: '/changePassword',
        templateUrl: 'views/user/profile.changePassword.html',
        data: { displayName: 'Change Password' }
      })
      .state('app.protected.user.profile.delete', {
        url: '/delete',
        templateUrl: 'views/user/profile.delete.html',
        data: { displayName: 'Delete Account' }
      })
      .state('app.protected.user.view', {
        url: '/users/:userId',
        templateUrl: 'views/user/profile.view.html',
        controller: 'ProfileViewController',
        data: { displayName: 'View Profile ({{ u.fullName }})' },
        resolve: { u: function ($stateParams, User) {
          return User.findById({ id: $stateParams.userId, filter: { fields: ['fullName'] }}).$promise;
        }}
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
        data: { displayName: 'Join Conference' }
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
        data: { displayName: 'Create Conference' }
      })
      .state('app.protected.user.conference.manage.edit', {
        templateUrl: 'views/user/manageConference.html',
        controller: 'CreateConferenceController',
        url: '/:conferenceId',
        data: { displayName: 'Edit Conference ({{ c.name }})' },
        resolve: { c: function ($stateParams, Conference) {
          return Conference.findById({ id: $stateParams.conferenceId, filter: { fields: ['name'] }}).$promise;
        }}
      })
      .state('app.protected.user.conference.my', {
        url: '/my',
        templateUrl: 'views/user/myConferences.html',
        controller: 'MyConferencesController',
        data: { displayName: 'My Conferences' },
      })
      .state('app.protected.conference', {
        url: 'conference/:conferenceId/',
        template: '<div ui-view></div>',
        abstract: true,
        controller: 'ConferenceController',
        data: { breadcrumbProxy: 'app.protected.conference.home' },
        resolve: { c: function (Conference, $stateParams) {
          return Conference.findById({ id: $stateParams.conferenceId, filter: { fields: ['name'] }}).$promise;
        }}
      })
      .state('app.protected.conference.home', {
        url: 'home',
        templateUrl: 'views/user/conference.landing.html',
        controller: 'ConferenceLandingController',
        data: { displayName: '{{ c.name }}' }
      })
      .state('app.protected.conference.statistics', {
        url: 'statistics',
        templateUrl: 'views/chair/statistics.html',
        controller: 'StatisticsController',
        data: { displayName: 'Statistics' }
      })
      .state('app.protected.conference.tag', {
        url: 'tag',
        templateUrl: 'views/chair/tag.html',
        controller: 'TagController',
        data: { displayName: 'Tag List' }
      })
      .state('app.protected.conference.affiliation', {
        url: 'affiliation',
        templateUrl: 'views/chair/affiliation.html',
        controller: 'AffiliationController',
        data: { displayName: 'Affiliation List' }
      })
      .state('app.protected.conference.users', {
        url: 'usermanagement',
        templateUrl: 'views/chair/userManagement.html',
        controller: 'ChairUserManagementController',
        data: { permissions: { only: ['CHAIR'] }, displayName: 'Manage Users' }
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
        data: { permissions: { only: ['CHAIR'] } }
      })
      .state('app.protected.conference.admin.reviews.assignment', {
        url: '/assignment',
        templateUrl: 'views/chair/reviewer.assignment.html',
        controller: 'ReviewerAssignmentController',
        data: { permissions: { only: ['CHAIR'] }, displayName: 'Assign Reviewer' }
      })
      .state('app.protected.conference.admin.reviews.submissionList', {
        url: '/submission/:submissionId',
        templateUrl: 'views/shared/reviews.list.html',
        controller: 'SubmissionReviewListController',
        data: { permissions: { only: ['CHAIR'] }, displayName: 'Reviews for {{ s.title }}' },
        resolve: { s: function ($stateParams, Submission) {
          return Submission.findById({ id: $stateParams.submissionId, filter: { fields: ['title'] }}).$promise;
        }}
      })
      .state('app.protected.conference.admin.reviews.list', {
        url: '/reviews',
        templateUrl: 'views/shared/reviews.list.html',
        controller: 'ChairReviewListController',
        data: { permissions: { only: ['CHAIR'] }, displayName: 'All Reviews' }
      })
      .state('app.protected.conference.admin.submissions', {
        url: '/submissions',
        templateUrl: 'views/chair/submissions.html',
        controller: 'SubmissionsChairController',
        data: { permissions: { only: ['CHAIR'] }, displayName: 'All Submissions' }
      })
      .state('app.protected.conference.admin.submissionsDetails', {
        url: '/submissions/:submissionId',
        templateUrl: 'views/shared/submission.details.html',
        controller: 'ViewSubmissionController',
        data: { permissions: { only: ['CHAIR'] }, displayName: 'Show Submission: {{ s.title }}' },
        resolve : { s: function (Submission, $stateParams) {
          return Submission.findById({ id: $stateParams.submissionId, filter: { fields: ['title'] }}).$promise;
        }}
      })
      .state('app.protected.conference.submission', {
        url: 'submission',
        abstract: true,
        template: '<div ui-view></div>',
        data: { permissions: { only: ['AUTHOR'] }, breadcrumbProxy: 'app.protected.conference.submission.list' }
      })
      .state('app.protected.conference.submission.list', {
        url: '/list',
        templateUrl: 'views/author/submissions.list.html',
        controller: 'SubmissionController',
        data: { permissions: { only: ['AUTHOR'] }, displayName: 'Submissions' }
      })
      .state('app.protected.conference.submission.create', {
        url: '/create',
        controller: 'SubmissionController',
        templateUrl: 'views/author/submissions.create.html',
        data: { displayName: 'Create' }
      })
      .state('app.protected.conference.submission.edit', {
        url: '/edit/:submissionId',
        controller: 'SubmissionController',
        templateUrl: 'views/author/submissions.create.html',
        data: { displayName: 'Edit: {{ s.title }}' },
        resolve: { s: function (Submission, $stateParams) {
          return Submission.findById({ id: $stateParams.submissionId, filter: { fields: ['title'] }}).$promise;
        }}
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
        data: { permissions: { only: ['AUTHOR'] }, displayName: 'Reviews for {{ s.title }}' },
        resolve: { s: function ($stateParams, Submission) {
          return Submission.findById({ id: $stateParams.submissionId, filter: { fields: ['title'] }}).$promise;
        }}
      })
      .state('app.protected.conference.review', {
        abstract: true,
        url: 'review',
        template: '<div ui-view></div>',
        controller: 'ReviewController',
        data: { permissions: { only: ['REVIEWER'] }, breadcrumbProxy: 'app.protected.conference.review.overview' }
      })
      .state('app.protected.conference.review.overview', {
        url: '/overview',
        templateUrl: 'views/reviewer/reviews.overview.html',
        controller: 'ReviewOverviewController',
        data: { permissions: { only: ['REVIEWER'] }, displayName: 'Reviews' }
      })
      .state('app.protected.conference.review.list', {
        url: '/list',
        templateUrl: 'views/shared/reviews.list.html',
        controller: 'ReviewListController',
        data: { permissions: { only: ['REVIEWER', 'CHAIR'] }, displayName: 'List Reviews' }
      })
      .state('app.protected.conference.review.submission', {
        url: '/submission/:submissionId',
        templateUrl: 'views/shared/submission.details.html',
        controller: 'ViewSubmissionController',
        data: { permissions: { only: ['REVIEWER'] }, displayName: 'Show Submission: {{ s.title }}' },
        resolve: { s: function (Submission, $stateParams) {
          return Submission.findById({ id: $stateParams.submissionId, filter: { fields: ['title'] }}).$promise;
        }}
      })
      .state('app.protected.conference.review.edit', {
        url: '/edit/:reviewId',
        templateUrl: 'views/reviewer/reviews.edit.html',
        controller: 'ReviewCreateController',
        data: { permissions: { only: ['REVIEWER'] }, displayName: 'Edit Review: {{ r.submission.title }}' },
        resolve: { r: function ($stateParams, Review) {
          return Review.findById({
            id: $stateParams.reviewId,
            filter: { fields: ['submissionId'], include: [{ relation: 'submission', scope: { fields: ['title'] }}] }
          }).$promise;
        }}
      });
  }])
.factory('ConferenceService', ['$q', 'Conference', function ($q, Conference) {
  var currentConferenceId = null, currentConference = $q.reject(),
    setCurrentConferenceId = function (conferenceId) {
      currentConferenceId = conferenceId ? parseInt(conferenceId, 10) : null;
      currentConference = conferenceId ? Conference.findById({id: currentConferenceId}).$promise : $q.reject();

      return currentConference;
    };

  return {
    getCurrentConferenceId: function () {
      return currentConferenceId;
    },
    getCurrentConference: function () {
      return currentConference;
    },
    setCurrentConferenceId: setCurrentConferenceId,
    isSubmissionPhase: function() {
      return currentConference.then(function(c) {
        return c.forceSubmission || (new Date(c.submissionDeadline)).getTime() > Date.now();
      });
    },
    isReviewPhase: function() {
      return currentConference.then(function(c) {
        return c.forceReview ||
          (new Date(c.reviewDeadline)).getTime() > Date.now() &&
          (new Date(c.submissionDeadline)).getTime() < Date.now();
      });
    },
    reviewsDone: function() {
      return currentConference.then(function(c) {
        return (new Date(c.reviewDeadline)).getTime() < Date.now();
      });
    },
    invalidate: function () {
      return setCurrentConferenceId(currentConferenceId);
    }
  }
}])
.factory('SessionService', [function () {
  var flashMessage = null;

  return {
    hasFlash: function () { return !!flashMessage; },
    getFlash: function () { var m = flashMessage; flashMessage = null; return m || ''; },
    setFlash: function (msg) { flashMessage = msg; },
    destroy: function () { flashMessage = null; }
  };
}])
.factory('AuthService', ['$q', 'LoopBackAuth', 'User', 'ConferenceService', 'SessionService',
    function ($q, LoopBackAuth, User, ConferenceService, SessionService) {
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
      LoopBackAuth.clearUser();
      LoopBackAuth.clearStorage();
      ConferenceService.setCurrentConferenceId();
      return $q.resolve();
    },
    hasRole = function (role) {
      return user.then(function (user) {
        return _(user[role]).findWhere({ id: ConferenceService.getCurrentConferenceId() }) ?
          $q.resolve() : $q.reject();
      }, function () {
        return $q.reject();
      });
    },
    isAuthenticated = User.isAuthenticated.bind(User),
    retrieveUserWithRoles = function (userId) {
      var user = User.findById({id: userId, filter: {
        include: ['reviewer', 'author', 'attendee', 'chair'].map(function (role) {
          return { relation: role, scope: { fields: ['id'] }};
        })
      }}).$promise;

      user.then(function (model) {
        ConferenceService.setCurrentConferenceId(model.defaultConferenceId);
      });

      return user;
    },
    init = function () {
      return user = isAuthenticated() ?
        retrieveUserWithRoles(LoopBackAuth.currentUserId) :
        $q.reject();
    };

  init();

  return {
    login: login,
    logout: logout,
    hasRole: hasRole,
    getUser: function () { return user; },
    getUserId: function () { return user.then(function (user) { return user.id; }); },
    getAccessTokenId: function () { return LoopBackAuth.accessTokenId; },
    isAuthenticated: isAuthenticated,
    invalidate : init
  };
}])
.factory('SubmissionStatus', [function () {
  return {
    // This flag is set by the author of the submission if he is ready to accept
    // reviews for his submission. Once set the submission become uneditable for
    // the author. If not set: Submission is a draft.
    Final: parseInt('1', 2),
    // This flag is set by the chair when the submission is approved to be
    // reviewed.
    Approved: parseInt('10', 2)
  }
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
.filter('submissionStatus', ['SubmissionStatus', function (SubmissionStatus) {
  return function (number) {
    var map = {};
    if (!!(number & SubmissionStatus.Final)) {
      map.Final = 'label-success';
    } else {
      map.Draft = 'label-warning';
    }

    if (!!(number & SubmissionStatus.Approved)) {
      map.Approved = 'label-success';
    } else {
      map.Unapproved = 'label-warning';
    }

    return map;
  };
}])
.config(function(uiGmapGoogleMapApiProvider) {
  uiGmapGoogleMapApiProvider.configure({
    key: 'AIzaSyA3SaBcz7amu_EeQekF4QHmixkf71tFyrE',
    v: '3',
    libraries: 'weather,geometry,visualization'
  })
})
.config(['showErrorsConfigProvider', function(showErrorsConfigProvider) {
  showErrorsConfigProvider.showSuccess(true);
}])
.config(['markdownConverterProvider', function (markdownConverterProvider) {
  // options to be passed to Showdown
  // see: https://github.com/coreyti/showdown#extensions
  markdownConverterProvider.config({
    extensions: []
  });
}])
.run(function($rootScope, $q, $stateParams, PermissionStore, RoleStore, AuthService) {
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
});
