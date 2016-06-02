angular
  .module('app')
  .controller('AccountController', ['$scope', 'AuthService', function($scope, AuthService) {
    $scope.user = {};

    AuthService.getUser().then(function (userData) {
      $scope.user = userData;
    });
  }])
  .controller('UserController', ['$scope', '$state', function($scope, $state) {

  }]);
