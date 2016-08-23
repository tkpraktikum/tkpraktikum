angular
  .module('app')
  .controller('SubmissionsChairController', ['$scope', '$state', 'Submission', 'Review', 'AuthService', 'User', '$stateParams',
    function($scope, $state, Submission, Review, AuthService, User, $stateParams) {

      Submission.find({conferenceId: AuthService.getCurrentConferenceId(), filter: { include: ['tags', 'authors']}})
        .$promise.then(function(s) {
          $scope.submissions = s;
      });
    }]);
