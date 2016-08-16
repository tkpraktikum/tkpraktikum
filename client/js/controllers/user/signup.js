angular
  .module('app')
  .controller('SignupController', ['$q', '$scope', '$state', '$http', 'Affiliation', function($q, $scope, $state, $http, Affiliation) {

    $scope.affiliations = [];
    $scope.newUser = {};
    $scope.newAffiliation = {};
    $scope.form = angular.element('#newUserForm');
    $scope.selected = {};
    $scope.affiliationInput = "";

    Affiliation.find().$promise.then(function (affiliations) {
      $scope.affiliations = affiliations;
    });

    $scope.submitForm = function(e) {
      if (!$scope.selected.selectedAffiliation) {
        $scope.affiliationMissing = true;
      } else {
        $scope.affiliationInput = $scope.selected.selectedAffiliation.id;
      }
    };

    var getAffiliations = function() {
      Affiliation.find().$promise.then(function(a) {
        $scope.affiliations = a;
      });
    };

    getAffiliations();
  }]);
