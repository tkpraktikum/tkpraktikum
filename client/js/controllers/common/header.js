angular
  .module('app')
  .controller('HeaderController', ['$scope', 'AuthService', function($scope, AuthService) {

    $scope.user = {};

    AuthService.getUser().then(function (userData) {
        $scope.user = userData;
      });

  }]);
