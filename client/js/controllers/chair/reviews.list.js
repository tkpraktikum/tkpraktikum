angular
  .module('app')
  .controller('ChairReviewListController', ['$scope', '$state', 'Review', 'AuthService', 'User', '$stateParams',
    function($scope, $state, Review, AuthService, User, $stateParams) {

      var ranking = {
        "-1": "Not Set",
        0: "None",
        1: "Less",
        2: "Ok",
        3: "Good",
        4: "Very Good"
      };

      Review.find({conferenceID: $stateParams.conferenceId, filter: {
        include: ['submission', { relation: 'reviewer', scope : { fields: ['fullName'] }}]
      }}).$promise.then(function(reviews) {
        $scope.reviews = reviews.map(function(r) {
          r.expertise = ranking[(r.expertise || 0) - 1];
          r.overall = ranking[(r.overall || 0) - 1];
          return r;
        });
      });

    }]);
