angular
  .module('app')
  .controller('LoginController', ['$scope', '$state', 'AuthService',
    function ($scope, $state, AuthService) {
      $scope.login = function () {
        AuthService
          .login($scope.user.username.toLowerCase(), $scope.user.password)
          .then(function (user) {
            if (user.defaultConferenceId && parseInt(user.defaultConferenceId, 10) !== 0) {
              $state.go('app.protected.conference.home', { conferenceId: user.defaultConferenceId }, {reload: true});
            } else {
              $state.go('app.protected.home', {}, {reload: true});
            }
          });
      }
    }])
  .controller('LogoutController', ['$scope', '$state', 'AuthService',
    function ($scope, $state, AuthService) {

      AuthService
        .logout()
        .then(function () {
          $state.go('app.login', {}, {reload: true});
        });
    }])
  .controller('HeaderCtrl', [function () {
  }]);
