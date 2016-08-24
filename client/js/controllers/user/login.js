angular
  .module('app')
  .controller('LoginController', ['$scope', '$state', 'AuthService', 'ConferenceService',
    function ($scope, $state, AuthService, ConferenceService) {
      $scope.login = function () {
        AuthService
          .login($scope.user.username.toLowerCase(), $scope.user.password)
          .then(function (user) {
            var cId = ConferenceService.getCurrentConferenceId();
            if (cId) {
              $state.go('app.protected.conference.home', { conferenceId: cId }, {reload: true});
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
