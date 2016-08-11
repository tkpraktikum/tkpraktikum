angular
  .module('app')
  .controller('ReviewController', ['$scope', '$state', 'Review', 'AuthService', 'User', function($scope,
                                                                         $state, Review, AuthService, User) {

    // sort by https://scotch.io/tutorials/sort-and-filter-a-table-using-angular
    $scope.sortType     = 'name'; // set the default sort type
    $scope.sortReverse  = false;  // set the default sort order
    $scope.searchReview   = '';     // set the default search/filter term
    $scope.reviews = [];
    $scope.newReview = {};

    AuthService.getUser().then(function (userData) {
      $scope.user = userData;
      getReviews();
    });

    function getReviews() {
      User
        .reviews
        .count({id: $scope.user.id})
        .$promise
        .then(function(result) {
          $scope.count = result.count;
        });
      User
        .reviews({id: $scope.user.id})
        .$promise
        .then(function(result) {
          console.log(JSON.stringify(result));
          $scope.reviews = result;
        });
    }

    $scope.createReview = function() {
      User
        .reviews
        .create({id: $scope.user.id}, $scope.newReview)
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
