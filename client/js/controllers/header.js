angular
  .module('app')
  .controller('HeaderController', ['$scope', '$state', '$q', 'User', 'AuthService', 'ConferenceService',
      function($scope, $state, $q, User, AuthService, ConferenceService) {
    $scope.user = {};
    $scope.conferences = [];
    $scope.currentConferenceId = ConferenceService.getCurrentConferenceId();
    $scope.conferenceName = 'TKonference - Team Whisky';
    $scope.phase = '';

    // Since HeaderController is not attached to a state with url parameters,
    // We need to listen for the stateChangeSuccess event to happen and check
    // whether we can extract the conferenceId from it.
    $scope.$on('$stateChangeSuccess', function (event, toState, toParams) {
      $scope.conferenceName = 'TKonference - Team Whisky';
      $scope.phase = '';

      // Only display conference name on pages that are actually conference
      // specific, i.e. do not display it on the 'profile' page etc.
      if (toParams.conferenceId) {
        $q.all([
          ConferenceService.getCurrentConference(),
          ConferenceService.isSubmissionPhase(),
          ConferenceService.isReviewPhase()
        ]).then(function (promises) {
          var conference = promises[0],
            isSubmissionPhase = promises[1],
            isReviewPhase = promises[2];

          $scope.conferenceName = conference.name;

          if (isSubmissionPhase) {
            $scope.phase = '<span class="label label-info">Submission Phase</span>';
          } else if (isReviewPhase) {
            $scope.phase = '<span class="label label-info">Review Phase</span>';
          } else {
            $scope.phase = '';
          }
        });
      }
    });

    $scope.changeConference = function(conferenceId) {
      ConferenceService.setCurrentConferenceId(conferenceId);
      $scope.currentConferenceId = conferenceId;
      $state.go('app.protected.conference.home', {
        conferenceId: conferenceId
      }, {reload: true});
    };


    ConferenceService.isSubmissionPhase().then(function(b) {
      $scope.isSubmissionPhase = b;
    });

    AuthService.getUser().then(function (userData) {
      $scope.user = userData;
      User.attendee({id: $scope.user.id}).$promise.then(function(conferences) {
        $scope.conferences = conferences;
      });
    });
  }]);
