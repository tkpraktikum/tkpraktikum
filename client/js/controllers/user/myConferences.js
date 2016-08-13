angular
  .module('app')
  .controller('MyConferencesController', ['$q', '$scope', '$state', '$http' , 'AuthService', 'User', 'Conference',
    function($q, $scope, $state, $http, AuthService, User, Conference) {

      $scope.user = AuthService.getUser;
      $scope.conferenceRows = [];

      var getConferences = function() {
        var toIdList = function(userList) {
          return userList.map(function (user) {
            return user.id;
          });
        };
        $scope.user.then(function(user) {
          var userId = user.id;
          $q.all([
            User.attendee({id: userId}).$promise,
            User.chair({id: userId}).$promise.then(toIdList),
            User.author({id: userId}).$promise.then(toIdList),
            User.reviewer({id: userId}).$promise.then(toIdList)
          ]).then(function(conferenceLists) {
            var conferences = conferenceLists[0].map(function (conference) {
              conference.isChair = conferenceLists[1].indexOf(conference.id) !== -1;
              conference.isAuthor = conferenceLists[2].indexOf(conference.id) !== -1;
              conference.isReviewer = conferenceLists[3].indexOf(conference.id) !== -1;
              conference.isDefault = conference.id == user.defaultConferenceId;
              return conference;
            });
            $scope.conferenceRows = [];
            for(var i=0; i < Math.ceil(conferences.length / 3); i++) {
              $scope.conferenceRows.push(conferences.slice(i*3, (i+1)*3));
            }
          });
        });
      };
      getConferences();

      $scope.setDefault = function(conference) {
        $scope.user.then(function(user) {
          User.prototype$updateAttributes({id: user.id}, {defaultConferenceId: conference.id});
        });
      };

    }]);
