angular
  .module('app')
  .controller('AccountController', ['$scope', 'AuthService', function ($scope, AuthService) {

    $scope.user = {};

    AuthService.getUser().then(function (userData) {
      $scope.user = userData;
    });

  }])
  .controller('UserController', ['$scope', 'AuthService', 'Affiliation', function ($scope, AuthService, Affiliation) {

    $scope.user = {};
    $scope.affiliations = [];
    $scope.changeUserProfile = {};
    $scope.changeUserPassword = {};
    $scope.deleteUserProfile = {};
    $scope.selectedItem = null;
    $scope.changeCaret = false;

    AuthService.getUser().then(function (userData) {
      $scope.user = userData;
    });


    function getAffiliations() {
      Affiliation
        .find()
        .$promise
        .then(function (results) {
          $scope.affiliations = results;
        });
    }

    getAffiliations();

    $scope.dropDownItemSelected = function (selection) {
      $scope.changeCaret = !$scope.changeCaret;
      $scope.selectedItem = selection.name;
      $scope.changeUserProfile.affiliation = selection.name;
      $scope.changeUserProfile.city = selection.city;
      $scope.changeUserProfile.state = selection.state;
      $scope.changeUserProfile.country = selection.country;
    };

    $scope.changeProfile = function () {
      console.log(JSON.stringify($scope.changeUserProfile));
    };

    $scope.deleteProfile = function () {
      console.log(JSON.stringify($scope.changeUserPassword));
    };

    $scope.changePassword = function () {
      console.log(JSON.stringify($scope.deleteUserProfile));
    };

  }]);
