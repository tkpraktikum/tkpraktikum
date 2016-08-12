angular
  .module('app')
  .controller('ConferenceManagementController', ['$scope', '$state', '$http' , 'AuthService', 'User', 'Conference',
      function($scope, $state, $http, AuthService, User, Conference) {

    $scope.newConference = {};
    $scope.conference = {};
    $scope.conferences = [];

    AuthService.getUser().then(function (userData) {
      $scope.user = userData;
      getConferences();
    });

    $scope.createConference = function() {
      User
        .chair
        .create({id: $scope.user.id}, $scope.newConference)
        .$promise
        .then(function (newConference) {
          $scope.newConference = {};
          User
            .attendee
            .link({id: $scope.user.id, fk: newConference.id},
              {attendeeId: $scope.user.id, conferenceId: newConference.id})
            .$promise
            .then(function() {
              getConferences();
            });
        });
    };

    $scope.joinConference = function() {
      Conference
        .find({filter: {where: {name: $scope.conference.name, sharedSecret: $scope.conference.sharedSecret}}})
        .$promise
        .then(function(res) {
          if (res.length == 0) {
            return console.error("No conference found");
          } else {
            User
              .attendee
              .link({id: $scope.user.id, fk: res[0].id},
                {attendeeId: $scope.user.id, conferenceId: res[0].id})
              .$promise.then(function() {
                getConferences();
            })
          }
        })
    };

    $scope.setDefault = function(conference) {
      User.prototype$updateAttributes({id: $scope.user.id}, {defaultConferenceId: conference.id});
    };

    var getConferences = function() {
      User.attendee({id: $scope.user.id}).$promise.then(function(conferences) {
        $scope.conferences = conferences;
      });
    };
  }]);
