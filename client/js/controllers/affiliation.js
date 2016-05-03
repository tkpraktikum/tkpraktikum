angular
  .module('app')
  .controller('AffiliationController', ['$scope', '$state', 'Affiliation', function($scope,
                                                                    $state, Affiliation) {
    $scope.affiliations = [];
    function getAffiliations() {
      Affiliation
        .find()
        .$promise
        .then(function(results) {
          $scope.affiliations = results;
        });
    }
    getAffiliations();

    $scope.removeAffiliation = function(item) {
      Affiliation
        .deleteById(item)
        .$promise
        .then(function() {
          getAffiliations();
        });
    };
  }]);
