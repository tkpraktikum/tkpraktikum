angular
  .module('app')
  .controller('ReviewOverviewController', ['$q', '$scope', '$state', 'Review', 'AuthService', 'ConferenceService', 'User', 'Submission', '$stateParams',
    function($q, $scope, $state, Review, AuthService, ConferenceService, User, Submission, $stateParams) {

      $scope.reviews = [];

      ConferenceService.isReviewPhase().then(function(b) {
        $scope.isReviewPhase = b;
      });

      AuthService.getUserId().then(function(userId) {
        User.reviews({id: userId, filter: {include: [{submission: ['tags']}]}})
          .$promise.then(function (reviews) {
            $scope.reviews = reviews;
        });
      });
    }]);
