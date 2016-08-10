angular
  .module('app')
  .controller('ReviewController', ['$scope', '$state', 'Review', function($scope,
                                                                         $state, Review) {

    // sort by https://scotch.io/tutorials/sort-and-filter-a-table-using-angular
    $scope.sortType     = 'name'; // set the default sort type
    $scope.sortReverse  = false;  // set the default sort order
    $scope.searchReview   = '';     // set the default search/filter term
    $scope.reviews = [];
    $scope.newReview = {};

    function getReviews() {
      Review
        .count()
        .$promise
        .then(function(result) {
          $scope.count = result.count;
        });
      Review
        .find()
        .$promise
        .then(function(result) {
          console.log(JSON.stringify(result));
          $scope.reviews = result;
        });
    }
    getReviews();

    $scope.createReview = function() {
      User
        .reviews
        .create({id: $scope.userId}, $scope.newReview)
        .$promise
        .then(function () {
          $scope.newReview = {};
          $('.focus').focus();
          getReviews()
        });
    };

    $scope.removeReview = function(item) {
      Review
        .deleteById(item)
        .$promise
        .then(function() {
          getReviews();
        });
    };

  }]);
