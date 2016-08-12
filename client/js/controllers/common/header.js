angular
  .module('app')
  .controller('HeaderController', ['$scope', 'User', 'AuthService', function($scope, User, AuthService) {

    $scope.user = {};
    $scope.defaultConference = -1;
    $scope.conference = [];

    AuthService.getUser().then(function (userData) {
        $scope.user = userData;
        $scope.defaultConference = userData.defaultConferenceId || -1;
        getConferences();
    });

    var getConferences = function() {
      User.attendee({id: $scope.user.id}).$promise.then(function(conferences) {
        $scope.conferences = conferences;
      });
    };
  }]);
