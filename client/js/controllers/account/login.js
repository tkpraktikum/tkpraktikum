angular
  .module('app')
  .controller('LoginController', ['$scope', '$http', '$state', function($scope, $http, $state) {

    $scope.user = {};

    $http({
      method: 'GET',
      url: '/auth/me'
    }).then(function successCallback(response) {
      $scope.user = response.data;
    }, function errorCallback(response) {
      console.log(JSON.stringify(response));
      // called asynchronously if an error occurs
      // or server returns response with an error status.
    });

  }]);
