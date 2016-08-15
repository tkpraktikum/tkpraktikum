angular
  .module('app')
  .controller('HeaderController', ['$scope', '$stateParams', '$state', 'User', 'AuthService',
      function($scope, $stateParams, $state, User, AuthService) {
    $scope.user = {};
    $scope.conferences = [];
    $scope.currentConferenceId = AuthService.getCurrentConferenceId();

    $scope.changeConference = function(conferenceId) {
      AuthService.setCurrentConferenceId(conferenceId);
      $scope.currentConferenceId = conferenceId;
      $state.go('app.protected.conference.tag', {
        conferenceId: conferenceId
      }, {reload: true});
    };

    AuthService.getUser().then(function (userData) {
      $scope.user = userData;
      User.attendee({id: $scope.user.id}).$promise.then(function(conferences) {
        $scope.conferences = conferences;
      });
    });
  }]);
