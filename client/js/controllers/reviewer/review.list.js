angular
  .module('app')
  .controller('ReviewListController', ['$scope', '$state', 'Review', 'AuthService', 'User', '$stateParams',
    function($scope, $state, Review, AuthService, User, $stateParams) {

      var ranking = ['None', 'Less', 'Ok', 'Good', 'Very Good'];

      AuthService.getUserId().then(function(userId) {
        User.reviews({id: userId, filter: {include: ['submission']}}).$promise.then(function(reviews) {
          $scope.reviews = reviews.map(function(r) {
            r.expertise = ranking[r.expertise - 1];
            r.overall = ranking[r.overall - 1];
            return r;
          });
        });
      });

    }]);
