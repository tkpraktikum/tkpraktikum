angular
  .module('app')
  .controller('ConferenceLandingController', ['$scope', 'Conference', 'AuthService', function ($scope, Conference, AuthService) {

    $scope.user = {};
    $scope.currentConferenceId = AuthService.getCurrentConferenceId();

    AuthService.getUser().then(function (userData) {
      $scope.user = userData;
    });

    var loadConference = function() {
      var id = AuthService.getCurrentConferenceId();
      Conference.findById({id: id}).$promise.then(function(c) {
        $scope.conference = c;
      });
    };

    loadConference();

  }]);
