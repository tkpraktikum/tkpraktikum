angular
  .module('app')
  .controller('SubmissionController', ['$scope', 'AuthService', '$state', 'Submission', function($scope, AuthService,
                                                                    $state, Submission) {

    // sort by https://scotch.io/tutorials/sort-and-filter-a-table-using-angular
    $scope.sortType     = 'name'; // set the default sort type
    $scope.sortReverse  = false;  // set the default sort order
    $scope.searchSubmission   = '';     // set the default search/filter term
    $scope.submissions = [];
    $scope.newSubmission = {};

    AuthService.getUser().then(function (userData) {
      $scope.user = userData;
    });

    function getSubmissions() {
      Submission
        .find()
        .$promise
        .then(function(result) {
          $scope.submissions = result;
          $scope.count = result.length;
        });
    }
    getSubmissions();

    $scope.createSubmission = function() {
      Submission
        .create({}, $scope.newSubmission)
        .$promise
        .then(
          function (submission) {
            console.log($scope.user.id);
            return Submission.authors.link({id: submission.id, fk: $scope.user.id});
          }
        )
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
