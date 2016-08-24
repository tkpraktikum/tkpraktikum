angular
  .module('app')
  .controller('HeaderController', ['$scope', '$stateParams', '$state', 'User', 'AuthService', 'ConferenceService',
      function($scope, $stateParams, $state, User, AuthService, ConferenceService) {
    $scope.user = {};
    $scope.conferences = [];
    $scope.currentConferenceId = ConferenceService.getCurrentConferenceId();

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
