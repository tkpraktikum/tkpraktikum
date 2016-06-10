angular
  .module('app')
  .controller('AccountController', ['$scope', 'AuthService', function($scope, AuthService) {
    $scope.user = {};

    AuthService.getUser().then(function (userData) {
      $scope.user = userData;
    });
  }])
  .controller('UserController', ['$scope', 'AuthService', 'Affiliation', function($scope, AuthService, Affiliation) {
    $scope.user = {};
    $scope.affiliations = [];

    AuthService.getUser().then(function (userData) {
      $scope.user = userData;
    });


    function getAffiliations() {
      Affiliation
        .find()
        .$promise
        .then(function(results) {
          $scope.affiliations = results;
        });
    }

    getAffiliations();

    $scope.changeProfile = function () {

    };

    $scope.deleteProfile = function () {

    };

    $scope.changePassword = function () {

    };

  }]);
