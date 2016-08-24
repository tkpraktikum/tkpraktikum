angular
  .module('app')
  .controller('LayoutController', ['$scope', 'SessionService', function ($scope, SessionService) {
    if (SessionService.hasFlash()) {
      $scope.flashMessage = SessionService.getFlash();
    }

    $scope.dismissFlash = function ($e) {
      $scope.flashMessage = null;
    };
}]);
