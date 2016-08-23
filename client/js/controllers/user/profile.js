angular
  .module('app')
  .controller('ProfileController', ['$scope', '$state', 'AuthService', 'Affiliation', 'User', 'uiGmapGoogleMapApi', function ($scope, $state, AuthService, Affiliation, User, uiGmapGoogleMapApi) {


    uiGmapGoogleMapApi.then(function(maps) {
      $scope.geocoder = new google.maps.Geocoder();
    });

    var refreshMap = function(address) {
      if ($scope.geocoder) {
        $scope.geocoder.geocode({'address': address}, function(results, status) {
          if (status === google.maps.GeocoderStatus.OK) {
            $scope.changeUserProfile.lat = results[0].geometry.location.lat();
            $scope.changeUserProfile.lng = results[0].geometry.location.lng();
            $scope.map.markers = [{
              id: 'home',
              coords: {
                latitude: results[0].geometry.location.lat(),
                longitude: results[0].geometry.location.lng()
              }
            }];
            var ll = new google.maps.LatLng(results[0].geometry.location.lat(),results[0].geometry.location.lng());
            $scope.map.control.getGMap().panTo(ll);
          } else {
            console.log('Geocode was not successful for the following reason: ' + status);
          }
        });
      }
    };

    $scope.lastTrigger = 0;
    $scope.triggerRefresh = function() {
      $scope.lastTrigger = Date.now();
      setTimeout((function() {
        var myTrigger = $scope.lastTrigger;
        return function() {
          if (myTrigger == $scope.lastTrigger) {
            var address = $scope.changeUserProfile.street
              + ' ' + $scope.changeUserProfile.zipcode
              + ' ' + $scope.changeUserProfile.city
              + ' ' + $scope.changeUserProfile.state
              + ' ' + $scope.changeUserProfile.country;
            console.log(address);
            refreshMap(address);
          }
        };
      })(), 1500);
    };

    $scope.map = { control: {}, center: { latitude: 49.877613, longitude: 8.654847 }, zoom: 14 };

    var attributes = ['title', 'email', 'lng', 'lat', 'username', 'firstname', 'lastname', 'profession', 'affiliation', 'street', 'zip', 'city', 'state', 'country'];
    $scope.user = {};
    $scope.affiliations = [];
    $scope.changeUserProfile = {};
    $scope.changeUserPassword = {};
    $scope.deleteUserProfile = {};
    $scope.changeCaret = false;
    $scope.selected = {};

    Affiliation.find().$promise.then(function (affiliations) {
      $scope.affiliations = affiliations;
      AuthService.getUser().then(function (userData) {
        $scope.user = userData;
        if ($scope.user.lat) {
          $scope.map.markers = [{
            id: 'home',
            coords: {
              latitude: $scope.user.lat,
              longitude: $scope.user.lng
            }
          }];
          if ($scope.userMap) {
            var ll = new google.maps.LatLng($scope.user.lat, $scope.user.lng);
            $scope.map.control.getGMap().panTo(ll);
          } else {
            $scope.map.center.latitude = $scope.user.lat;
            $scope.map.center.longitude = $scope.user.lng;
          }
        }
        attributes.map(function(p) {
          $scope.changeUserProfile[p] = userData[p] || '';
          if (p === 'affiliation' && userData[p]) {
            $scope.selected.selectedAffiliation = affiliations.filter(function(a) { return a.id == userData[p]; })[0];
          }
        });
      });
    });

    $scope.changeProfile = function () {
      var updates = {};
      $scope.changeUserProfile.affiliation = $scope.selected.selectedAffiliation.id;
      attributes.map(function(p) {
        if ($scope.changeUserProfile[p] !== $scope.user[p]) {
          updates[p] = $scope.changeUserProfile[p];
        }
      });
      console.log(updates);
      User.prototype$updateAttributes({id: $scope.user.id}, updates).$promise.then(function() {
        $scope.showSuccess = true;
      });
    };

    $scope.deleteProfile = function () {
      console.log(JSON.stringify($scope.changeUserPassword));
    };

    $scope.changePassword = function () {
      if ($scope.changeUserPassword.newPassword == $scope.changeUserPassword.confirmNewPassword) {
        $scope.user.password = $scope.changeUserPassword.newPassword;
        var updates = {
          password: $scope.changeUserPassword.newPassword
        };
        User.prototype$updateAttributes({id: $scope.user.id}, updates).$promise.then(function() {
          console.log("Success");
        });
      }
    };

  }]);

