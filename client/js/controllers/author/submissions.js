angular
  .module('app')
  .controller('SubmissionController',
      ['$scope', 'AuthService', '$state', '$stateParams', 'User', 'Submission', function($scope, AuthService,
                                                                    $state, $stateParams, User, Submission) {

    // sort by https://scotch.io/tutorials/sort-and-filter-a-table-using-angular
    $scope.sortType     = 'name'; // set the default sort type
    $scope.sortReverse  = false;  // set the default sort order
    $scope.searchSubmission   = '';     // set the default search/filter term
    $scope.submissions = [];
    $scope.newSubmission = {};

    function getSubmissions() {
      AuthService.getUserId().then(function(userId) {
        User
          .submissions({id: userId, filter: { where: {conferenceId: $stateParams.conferenceId}, include: ['tags', 'authors']}})
          .$promise
          .then(function(result) {
            $scope.submissions = result.map(function(s) {
              s.authors = s.authors.map(function(a) {
                a.fullName = a.firstname + ' ' + a.lastname;
                return a;
              });
              return s;
            });
            $scope.count = result.length;
          });
      });
    }
    getSubmissions();

    $scope.deleteSubmission = function(submission) {
      Submission
        .deleteById(submission)
        .$promise
        .then(function() {
          getSubmissions();
        });
    };
  }]);
