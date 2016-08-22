angular
  .module('app')
  .controller('ReviewOverviewController', ['$q', '$scope', '$state', 'Review', 'AuthService', 'User', 'Submission', '$stateParams',
    function($q, $scope, $state, Review, AuthService, User, Submission, $stateParams) {

      $scope.reviews = [];

      AuthService.getUserId().then(function(userId) {
        User.reviews({id: userId, filter: {include: [{submission: ['tags']}]}})
          .$promise.then(function (reviews) {
            $scope.reviews = reviews;
        });
      });
    }]);
