angular
  .module('app')
  .controller('ProfileViewController', ['$scope', '$state', 'AuthService', 'User', '$stateParams', 'uiGmapGoogleMapApi', 'uiGmapIsReady', function ($scope, $state, AuthService, User, $stateParams, uiGmapGoogleMapApi, IsReady) {

    $scope.map = { control: {}, center: { latitude: 49.877613, longitude: 8.654847 }, zoom: 14 };

    var refreshMap = function() {
      if ($scope.ready && $scope.user && $scope.user.lat && $scope.user.lng) {
        $scope.map.markers = [{
          id: 'home',
          coords: {
            latitude: $scope.user.lat,
            longitude: $scope.user.lng
          }
        }];
        var ll = new google.maps.LatLng($scope.user.lat, $scope.user.lng);
        $scope.map.control.getGMap().panTo(ll);
      }
    };

    User.findById({id: $stateParams.userId, filter: { include: ['affiliation'] } }).$promise.then(function(u) {
      $scope.user = u;
      if (u.lat && u.lng) {
        refreshMap();
      }
    });

    IsReady.promise().then(function (maps) {
      $scope.ready = true;
      refreshMap();
    });

  }]);
