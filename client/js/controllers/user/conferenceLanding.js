angular
  .module('app')
  .controller('ConferenceLandingController', ['$scope', 'Conference', 'AuthService', 'ConferenceService',
      function ($scope, Conference, AuthService, ConferenceService) {
    $scope.user = {};
    $scope.currentConferenceId = ConferenceService.getCurrentConferenceId();

    AuthService.getUser().then(function (userData) {
      $scope.user = userData;
    });

    var loadConference = function() {
      var id = ConferenceService.getCurrentConferenceId();
      Conference.findById({id: id}).$promise.then(function(c) {
        $scope.conference = c;
      });
    };

    loadConference();

  }]);
