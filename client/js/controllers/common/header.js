angular
  .module('app')
  .controller('HeaderController', ['$scope', 'AuthService', function($scope, AuthService) {

    $scope.user = {};
    $scope.defaultConference = 2;
    $scope.currentConference = 1;

    AuthService.getUser().then(function (userData) {
        $scope.user = userData;
      });

  }]);
