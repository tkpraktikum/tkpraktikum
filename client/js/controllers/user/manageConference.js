angular
  .module('app')
  .controller('CreateConferenceController', ['$scope', '$state', '$stateParams', '$http' , 'AuthService', 'User', 'Conference',
    function($scope, $state, $stateParams, $http, AuthService, User, Conference) {

      var subDeadline = $('#submissionDeadline');
      var revDeadline = $('#reviewDeadline');

      subDeadline.datetimepicker();
      revDeadline.datetimepicker();

      var hideIcons = ["guide", "fullscreen", "side-by-side"];
      $scope.conferenceDescriptionEditor = new SimpleMDE({ hideIcons: hideIcons, element: document.getElementById("conferenceDescription") });

      $scope.conference = {
      };

      $scope.editMode = !!$stateParams.conferenceId;

      if ($scope.editMode) {
        Conference.findById({id: $stateParams.conferenceId}).$promise.then(function (c) {
          subDeadline.data("DateTimePicker").date(moment(c.submissionDeadline || Date.now()));
          revDeadline.data("DateTimePicker").date(moment(c.reviewDeadline || Date.now() + 3600000 * 24));
          $scope.conferenceDescriptionEditor.value(c.description);
          $scope.conference = c;
          delete $scope.conference.id;
        });
      } else {
        subDeadline.data("DateTimePicker").date(moment(Date.now()));
        revDeadline.data("DateTimePicker").date(moment(Date.now() + 3600000 * 24));
      }

      $scope.create = function() {
        $scope.conference.submissionDeadline = subDeadline.data("DateTimePicker").date().valueOf();
        $scope.conference.reviewDeadline = revDeadline.data("DateTimePicker").date().valueOf();
        $scope.conference.description = $scope.conferenceDescriptionEditor.value();
        if ($scope.editMode) {
          Conference.prototype$updateAttributes({id: $stateParams.conferenceId}, $scope.conference).$promise
            .then(function() {
              $state.go('app.protected.user.conference.my');
            });
        } else {
          AuthService.getUserId().then(function(userId) {
            User
              .chair
              .create({id: userId}, $scope.conference)
              .$promise
              .then(function (conference) {
                User
                  .attendee
                  .link({id: userId, fk: conference.id},
                    {attendeeId: userId, conferenceId: conference.id})
                  .$promise
                  .then(function () {
                    $state.go('app.protected.user.conference.my');
                  });
              });
          });
        }
      };
    }]);
