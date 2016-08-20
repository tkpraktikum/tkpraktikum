angular
  .module('app')
  .controller('ReviewCreateController', ['$scope', '$state', 'Review', 'AuthService', 'User', '$stateParams',
    function($scope, $state, Review, AuthService, User, $stateParams) {
      var hideIcons = ["guide", "fullscreen", "side-by-side"];
      $scope.reviewStrongEditor = new SimpleMDE({ hideIcons: hideIcons, element: document.getElementById("reviewStrong") });
      $scope.reviewWeakEditor = new SimpleMDE({ hideIcons: hideIcons, element: document.getElementById("reviewWeak") });
      $scope.reviewSummaryEditor = new SimpleMDE({ hideIcons: hideIcons, element: document.getElementById("reviewSummary") });
      $scope.reviewDetailedEditor = new SimpleMDE({ hideIcons: hideIcons, element: document.getElementById("reviewDetailed") });
    }]);
