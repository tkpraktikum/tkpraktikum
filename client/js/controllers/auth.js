angular
  .module('app')
  .controller('LoginController', ['$scope', '$state', 'AuthService',
      function($scope, $state, AuthService) {
    $scope.login = function () {
      AuthService
        .login($scope.user.name, $scope.user.password)
        .then(function (user) {
          $state.go('app.private.account', {}, { reload: true });
        });
    }
  }])
  .controller('LogoutController', ['$scope', '$state', 'AuthService',
      function ($scope, $state, AuthService) {

    AuthService
      .logout()
      .then(function () {
        $state.go('app.public.login', {}, { reload: true });
      });
  }])
  .controller('HeaderCtrl', [function () { }]);
