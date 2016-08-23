angular
  .module('app')
  .controller('ProfileViewController', ['$scope', '$state', 'AuthService', 'Affiliation', 'User', '$stateParams', function ($scope, $state, AuthService, Affiliation, User, $stateParams) {

    User.findById({id: $stateParams.userId, include: ['useraffiliation']}).$promise.then(function(u) {
      $scope.user = u;
      if(u.affiliation == null)
        return;
      Affiliation.findById({id: u.affiliation, include: ['affiliation']}).$promise.then(function(a) {
        $scope.user.affiliation = a;
      }).catch(function() {
        console.log('Affiliation data error!');
      })
    }).catch(function() {
      console.log('User data error!');
    });

  }]);
