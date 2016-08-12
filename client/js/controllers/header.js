angular
  .module('app')
  .controller('HeaderController', ['$scope', '$rootScope', '$stateParams', '$state', 'User', 'AuthService',
      function($scope, $rootScope, $stateParams, $state, User, AuthService) {

        $scope.user = {};
        $scope.conference = [];

        $scope.changeConference = function(conferenceId) {
          window.localStorage.setItem('currentConference', conferenceId);
          $rootScope.currentConferenceId = conferenceId;
          $state.reload();
        };

        AuthService.getUser.then(function (userData) {
            $scope.user = userData;
            getConferences();
        });

        var getConferences = function() {
          User.attendee({id: $scope.user.id}).$promise.then(function(conferences) {
            $scope.conferences = conferences;
          });
        };
      }
  ]);
