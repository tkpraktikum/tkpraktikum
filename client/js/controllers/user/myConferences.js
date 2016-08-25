angular
  .module('app')
  .controller('MyConferencesController', ['$q', '$scope', '$state', '$http' , 'AuthService', 'User', 'Conference', 'ConferenceService',
    function($q, $scope, $state, $http, AuthService, User, Conference, ConferenceService) {

      $scope.conferences = [];

      var getConferences = function() {
        var toIdList = function(userList) {
          return userList.map(function (user) {
            return user.id;
          });
        };
        AuthService.getUser().then(function(user) {
          var userId = user.id;
          $q.all([
            User.attendee({id: userId}).$promise,
            User.chair({id: userId}).$promise.then(toIdList),
            User.author({id: userId}).$promise.then(toIdList),
            User.reviewer({id: userId}).$promise.then(toIdList)
          ]).then(function(conferenceLists) {
            $scope.conferences = conferenceLists[0].map(function (conference) {
              conference.isChair = conferenceLists[1].indexOf(conference.id) !== -1;
              conference.isAuthor = conferenceLists[2].indexOf(conference.id) !== -1;
              conference.isReviewer = conferenceLists[3].indexOf(conference.id) !== -1;
              conference.isDefault = conference.id == user.defaultConferenceId;
              conference.submissionDeadline = moment(conference.submissionDeadline).format('MMMM Do YYYY, h:mm a');
              conference.reviewDeadline = moment(conference.reviewDeadline).format('MMMM Do YYYY, h:mm a');
              return conference;
            });
          });
        });
      };
      getConferences();

      $scope.setDefault = function(id) {
        AuthService.getUser().then(function(user) {
          User.prototype$updateAttributes({id: user.id}, {defaultConferenceId: id});
        });
      };

      $scope.changeConference = function(conferenceId) {
        ConferenceService.setCurrentConferenceId(conferenceId);
        $scope.currentConferenceId = conferenceId;
        $state.go('app.protected.conference.home', {
          conferenceId: conferenceId
        }, {reload: true});
      };

    }]);
