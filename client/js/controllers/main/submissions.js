angular
  .module('app')
  .controller('SubmissionController', ['$scope', '$state', 'Submission', function($scope,
                                                                    $state, Submission) {

    // sort by https://scotch.io/tutorials/sort-and-filter-a-table-using-angular
    $scope.sortType     = 'name'; // set the default sort type
    $scope.sortReverse  = false;  // set the default sort order
    $scope.searchSubmission   = '';     // set the default search/filter term
    $scope.submissions = [];
    $scope.newSubmission = {};

    function getSubmissions() {
      Submission
        .count()
        .$promise
        .then(function(result) {
          $scope.count = result.count;
        });
      Submission
        .find()
        .$promise
        .then(function(result) {
          console.log(JSON.stringify(result));
          $scope.submissions = result;
        });
    }
    getSubmissions();

    $scope.createSubmission = function() {
      Submission
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
