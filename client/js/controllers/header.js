angular
  .module('app')
  .controller('HeaderController', ['$scope', '$state', 'User', 'AuthService', 'ConferenceService',
      function($scope, $state, User, AuthService, ConferenceService) {
    $scope.user = {};
    $scope.conferences = [];
    $scope.currentConferenceId = ConferenceService.getCurrentConferenceId();
    $scope.conferenceName = 'TKonference - Team Whisky';
    $scope.deadlines = null;

    // Since HeaderController is not attached to a state with url parameters,
    // We need to listen for the stateChangeSuccess event to happen and check
    // whether we can extract the conferenceId from it.
    $scope.$on('$stateChangeSuccess', function (event, toState, toParams) {
      $scope.conferenceName = 'TKonference - Team Whisky';
      $scope.deadlines = null;

      // Only display conference name on pages that are actually conference
      // specific, i.e. do not display it on the 'profile' page etc.
      if (toParams.conferenceId) {
        ConferenceService.getCurrentConference().then(function (c) {
            $scope.conferenceName = c.name;
            if (c.submissionDeadline && c.reviewDeadline) {
              $scope.deadlines = [c.submissionDeadline, c.reviewDeadline];
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
