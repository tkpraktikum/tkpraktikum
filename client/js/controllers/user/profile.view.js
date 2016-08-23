angular
  .module('app')
  .controller('ProfileViewController', ['$scope', '$state', 'AuthService', 'User', '$stateParams', function ($scope, $state, AuthService, User, $stateParams) {


    User.findById({id: $stateParams.userId, filter: {include: ['affiliations']}}).$promise.then(function(u) {
      $scope.user = u;
    });

  }]);
