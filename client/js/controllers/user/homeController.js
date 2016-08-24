angular
  .module('app')
  .controller('HomeController', ['$scope', '$state', 'AuthService', 'User', 'ConferenceService', function ($scope, $state, AuthService, User, ConferenceService) {

    $scope.user = {};

    AuthService.getUser().then(function (userData) {
      $scope.user = userData;
      User.attendee({id: $scope.user.id}).$promise.then(function(conferences) {
        $scope.conferences = conferences;
      });
    });

    $scope.changeConference = function(conferenceId) {
      ConferenceService.setCurrentConferenceId(conferenceId);
      $state.go('app.protected.conference.home', {
        conferenceId: conferenceId
      }, {reload: true});
    };

  }]);
