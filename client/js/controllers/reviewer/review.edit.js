angular
  .module('app')
  .controller('ReviewCreateController', ['$scope', '$state', 'Submission', 'Review', 'AuthService', 'User', '$stateParams',
    function($scope, $state, Submission, Review, AuthService, User, $stateParams) {

      $scope.submission = {
      };

      $scope.review = {

      };

      var hideIcons = ["guide", "fullscreen", "side-by-side"];
      $scope.reviewStrongEditor = new SimpleMDE({ hideIcons: hideIcons, element: document.getElementById("reviewStrong") });
      $scope.reviewWeakEditor = new SimpleMDE({ hideIcons: hideIcons, element: document.getElementById("reviewWeak") });
      $scope.reviewSummaryEditor = new SimpleMDE({ hideIcons: hideIcons, element: document.getElementById("reviewSummary") });
      $scope.reviewDetailedEditor = new SimpleMDE({ hideIcons: hideIcons, element: document.getElementById("reviewDetailed") });

      Review.findById({id: $stateParams.reviewId, filter: { include: ['submission']}}).$promise
        .then(function(review) {
          $scope.submission = review.submission;
          delete review.submission;
          delete review.submissionId;
          delete review.reviewerId;
          $scope.review = review;
          $scope.reviewStrongEditor.value(review.strong);
          $scope.reviewWeakEditor.value(review.weak);
          $scope.reviewSummaryEditor.value(review.summary);
          $scope.reviewDetailedEditor.value(review.detailed);
        });

      $scope.editReview = function() {
        $scope.review.strong = $scope.reviewStrongEditor.value();
        $scope.review.weak = $scope.reviewWeakEditor.value();
        $scope.review.summary = $scope.reviewSummaryEditor.value();
        $scope.review.detailed = $scope.reviewDetailedEditor.value();
        Review.prototype$updateAttributes({id: $scope.review.id}, $scope.review).$promise.then(function() {
          $scope.updateSuccessful = true;
        });
      };
    }]);
