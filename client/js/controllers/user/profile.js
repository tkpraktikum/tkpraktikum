angular
  .module('app')
  .controller('ProfileController', ['$scope', '$state', 'AuthService', 'Affiliation', 'User', function ($scope, $state, AuthService, Affiliation, User) {

    var attributes = ['title', 'email', 'username', 'firstname', 'lastname', 'profession', 'affiliationId', 'zip', 'city', 'state', 'country'];
    $scope.user = {};
    $scope.affiliations = [];
    $scope.changeUserProfile = {};
    $scope.changeUserPassword = {};
    $scope.deleteUserProfile = {};
    $scope.changeCaret = false;
    $scope.selected = {};

    Affiliation.find().$promise.then(function (affiliations) {
      $scope.affiliations = affiliations;

      AuthService.getUser().then(function (userData) {
        $scope.user = userData;
        attributes.map(function(p) {
          $scope.changeUserProfile[p] = userData[p] || '';

          if (p === 'affiliationId' && userData[p]) {
            $scope.selected.selectedAffiliation = _(affiliations).findWhere({ id: userData[p] });
          }
        });
      });
    });

    $scope.changeProfile = function () {
      var updates = {};
      $scope.changeUserProfile.affiliationId = $scope.selected.selectedAffiliation.id;
      attributes.map(function(p) {
        if ($scope.changeUserProfile[p] !== $scope.user[p]) {
          updates[p] = $scope.changeUserProfile[p];
        }
      });

      User.prototype$updateAttributes({id: $scope.user.id}, updates).$promise.then(function() {
        $scope.showSuccess = true;
      });
    };

    $scope.deleteProfile = function () {
      console.log(JSON.stringify($scope.changeUserPassword));
    };

    $scope.changePassword = function () {
      if ($scope.changeUserPassword.newPassword == $scope.changeUserPassword.confirmNewPassword) {
        $scope.user.password = $scope.changeUserPassword.newPassword;
        var updates = {
          password: $scope.changeUserPassword.newPassword
        };
        User.prototype$updateAttributes({id: $scope.user.id}, updates).$promise.then(function() {
          console.log("Success");
        });
      }
    };

  }]);

