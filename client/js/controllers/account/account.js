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

    Affiliation.find().$promise.then(function (affiliations) {
      $scope.affiliations = affiliations;
    });

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

  }])
  .controller('UserListController', ['$scope', 'User', function ($scope, User) {

    $scope.users = [];
    $scope.searchUser   = '';
    $scope.sortReverse  = false;

    User.find().$promise.then(function (users) {
      $scope.users = users;
    });

  }]);
