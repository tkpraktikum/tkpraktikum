angular
  .module('app')
  .controller('ReviewListController', ['$scope', '$state', 'Review', 'AuthService', 'User', '$stateParams',
    function($scope, $state, Review, AuthService, User, $stateParams) {

      var ranking = {
        "-1": "Not Set",
        0: "None",
        1: "Less",
        2: "Ok",
        3: "Good",
        4: "Very Good"
      };

      $scope.reviewer = true;

      AuthService.getUserId().then(function(userId) {
        User.reviews({id: userId, filter: {include: ['submission']}}).$promise.then(function(reviews) {
          $scope.reviews = reviews.map(function(r) {
            r.expertise = ranking[(r.expertise || 0) - 1];
            r.overall = ranking[(r.overall || 0) - 1];
            return r;
          });
        });
      });

    }]);
