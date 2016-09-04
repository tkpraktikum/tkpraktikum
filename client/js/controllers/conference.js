angular
  .module('app')
  .controller('ConferenceController', ['$stateParams', 'ConferenceService', function($stateParams, ConferenceService) {
    ConferenceService.setCurrentConferenceId($stateParams.conferenceId);
  }]);
