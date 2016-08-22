angular
  .module('app')
  .controller('ViewSubmissionController', ['$scope', '$state', 'Submission', 'Review', 'AuthService', 'User', '$stateParams',
    function($scope, $state, Submission, Review, AuthService, User, $stateParams) {

      Submission.findById({id: $stateParams.submissionId, filter: {include: ['tags', 'authors']}}).$promise.then(function(s) {
        $scope.submission = s;
      });

    }]);
