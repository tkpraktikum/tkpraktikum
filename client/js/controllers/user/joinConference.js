angular
  .module('app')
  .controller('JoinConferenceController', ['$scope', '$state', '$http' , 'AuthService', 'User', 'Conference',
    function($scope, $state, $http, AuthService, User, Conference) {

      $scope.conference = {};
      $scope.allConferences = {};

      $scope.join = function() {
        AuthService.getUserId().then(function(userId) {
          Conference
            .find({filter: {where: {id: $scope.conference.id, sharedSecret: $scope.conference.sharedSecret}}})
            .$promise
            .then(function(res) {
              if (res.length == 0) {
                return console.error("No conference found");
              } else {
                User
                  .attendee
                  .link({id: userId, fk: res[0].id},
                    {attendeeId: userId, conferenceId: res[0].id})
                  .$promise.then(function() {
                    $state.go('app.protected.user.conference.my')
                })
              }
            })
        });
      };

      var getAllConferences = function() {
        Conference.find().$promise.then(function(conferences) {
          $scope.allConferences = conferences.map(function(c) {
            return {
              id: c.id,
              name: c.name
            }
          });
        });
      };
      getAllConferences();
    }]);
