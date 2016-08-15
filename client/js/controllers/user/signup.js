angular
  .module('app')
  .controller('SignupController', ['$q', '$scope', '$state', '$http', 'Affiliation', function($q, $scope, $state, $http, Affiliation) {

    $scope.affiliations = [];
    $scope.newUser = {};
    $scope.newAffiliation = {};
    $scope.form = angular.element('#newUserForm');

    $scope.submitForm = function() {
      if ($scope.newUser.affiliation == 0) {
        return Affiliation.create($scope.newAffiliation).$promise.then(function(affiliation) {
          $scope.newUser.affiliation = affiliation.id;
          $scope.form.submit()
        });
      } else {
        $scope.form.submit()
      }
    };

    var getAffiliations = function() {
      Affiliation.find().$promise.then(function(a) {
        $scope.affiliations = a;
      });
    };

    getAffiliations();
  }]);
