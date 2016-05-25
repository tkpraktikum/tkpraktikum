angular
  .module('app')
  .controller('SubmissionController', ['$scope', '$state', 'User', function($scope,
                                                                    $state, User) {

    // sort by https://scotch.io/tutorials/sort-and-filter-a-table-using-angular
    $scope.sortType     = 'name'; // set the default sort type
    $scope.sortReverse  = false;  // set the default sort order
    $scope.searchSubmission   = '';     // set the default search/filter term
    $scope.submissions = [];
    $scope.newSubmission = {};

    function getSubmissions() {
      User
        .submissions
        .count({id: $scope.userId})
        .$promise
        .then(function(result) {
          $scope.count = result.count;
        });
      User
        .submissions({id: $scope.userId})
        .$promise
        .then(function(result) {
          console.log(JSON.stringify(result));
          $scope.submissions = result;
        });
    }
    getSubmissions();

    $scope.createSubmission = function() {
      User
        .submissions
        .create({id: $scope.userId}, $scope.newSubmission)
        .$promise
        .then(function () {
          $scope.newSubmission = {};
          $('.focus').focus();
          getSubmissions()
        });
    };

    $scope.removeSubmission = function(item) {
      Submission
        .deleteById(item)
        .$promise
        .then(function() {
          getSubmissions();
        });
    };
  }]);
