angular
  .module('app')
  .controller('SubmissionsChairController', [
    '$scope', '$state', 'Submission', 'Review', 'ConferenceService', 'SubmissionStatus', 'User', '$stateParams',
    function($scope, $state, Submission, Review, ConferenceService, SubmissionStatus, User, $stateParams) {

      var loadSubmissions = function () {
        Submission.find({conferenceId: ConferenceService.getCurrentConferenceId(), filter: { include: ['tags', 'authors', 'documents']}})
          .$promise.then(function(submissions) {
            _(submissions).each(function (submission) {
              submission.isApproved = !!(submission.status & SubmissionStatus.Approved);
            });

            $scope.submissions = submissions;
        });
      };

      $scope.approve = true;

      $scope.toggleApproval = function (submission) {
        var newStatus = submission.isApproved ?
          submission.status | SubmissionStatus.Approved :
          submission.status & ~SubmissionStatus.Approved;

        Submission.patchAttributes({
          id: submission.id,
          status: newStatus
        }).$promise.finally(function () {
          loadSubmissions();
        });
      };

      loadSubmissions();
    }]);
