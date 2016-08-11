angular
  .module('app')
  .controller('SubmissionController', ['$scope', 'AuthService', '$state', 'User', function($scope, AuthService,
                                                                    $state, User) {

    // sort by https://scotch.io/tutorials/sort-and-filter-a-table-using-angular
    $scope.sortType     = 'name'; // set the default sort type
    $scope.sortReverse  = false;  // set the default sort order
    $scope.searchSubmission   = '';     // set the default search/filter term
    $scope.submissions = [];
    $scope.newSubmission = {};

    AuthService.getUser().then(function (userData) {
      $scope.user = userData;
      getSubmissions();
    });

    function getSubmissions() {
      User
        .submissions
        .count({id: $scope.user.id})
        .$promise
        .then(function(result) {
          $scope.count = result.count;
        });
      User
        .submissions({id: $scope.user.id})
        .$promise
        .then(function(result) {
          console.log(JSON.stringify(result));
          $scope.submissions = result;
        });
    }

    $scope.createSubmission = function() {
      User
        .submissions
        .create({id: $scope.user.id}, $scope.newSubmission)
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
