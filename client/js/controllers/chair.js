angular
  .module('app')
  .controller('ChairController', ['$scope', '$state', '$http' , 'User', function($scope, $state, $http, User) {

    // sort by https://scotch.io/tutorials/sort-and-filter-a-table-using-angular
    $scope.sortType     = 'name'; // set the default sort type
    $scope.sortReverse  = false;  // set the default sort order
    $scope.searchUser   = '';     // set the default search/filter term
    $scope.users = [];

    function getUsers() {
      User
        .find()
        .$promise
        .then(function(results) {
          $scope.users = results;
        });
    }
    getUsers();

    $scope.changeAuthor = function(user) {
      $http({
        method: 'PUT',
        url: '/api/users/' + user.id + '/author',
        data: {status: user.isAuthor}
      }).then(function successCallback(response) {
        getUsers();
      }, function errorCallback(response) {
        console.log(JSON.stringify(response));
        // called asynchronously if an error occurs
        // or server returns response with an error status.
      });
    };

    $scope.changeReviewer = function(user) {
      $http({
        method: 'PUT',
        url: '/api/users/' + user.id + '/reviewer',
        data: {status: user.isReviewer}
      }).then(function successCallback(response) {
        getUsers();
      }, function errorCallback(response) {
        console.log(JSON.stringify(response));
        // called asynchronously if an error occurs
        // or server returns response with an error status.
      });
    }

  }]);
