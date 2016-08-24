angular
  .module('app')
  .controller('ConferenceController', ['$stateParams', '$scope', 'ConferenceService', function($stateParams, $scope, ConferenceService) {
    ConferenceService.setCurrentConferenceId($stateParams.conferenceId);
  }]);
