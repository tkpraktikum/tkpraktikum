angular
  .module('app')
  .controller('ConferenceController', ['$stateParams', '$scope', '$rootScope', function($stateParams, $scope, $rootScope) {
    $rootScope.conferenceId = $stateParams.conferenceId;
    $scope.stateParams = $stateParams;

    $scope.$watchCollection('stateParams', function(){
      $rootScope.currentConferenceId = $stateParams.conferenceId;
    });
  }]);
