angular
  .module('app')
  .controller('LayoutController', ['$scope', 'AuthService', function ($scope, AuthService) {
    if (AuthService.hasFlash()) {
      $scope.flashMessage = AuthService.getFlash();
    }

    $scope.dismissFlash = function ($e) {
      $scope.flashMessage = null;
    };
}]);
