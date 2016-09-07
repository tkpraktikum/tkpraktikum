angular
  .module('app')
  .controller('SubmissionsChairController', [
    '$scope', '$state', '$q', 'Submission', 'Review', 'ConferenceService', 'SubmissionStatus', 'SessionService', 'User', '$stateParams',
    function($scope, $state, $q, Submission, Review, ConferenceService, SubmissionStatus, SessionService, User, $stateParams) {

      var loadSubmissions = function () {
        Submission.find({conferenceId: ConferenceService.getCurrentConferenceId(), filter: { include: ['tags', 'authors', 'documents']}})
          .$promise.then(function(submissions) {
            _(submissions).each(function (submission) {
              submission.isApproved = !!(submission.status & SubmissionStatus.Approved);
            });

            $scope.submissions = submissions;
        });
      },
      deleteSubmission = function (submissionId) {
        var p1 = Submission.tags.destroyAll({ id: submissionId }).$promise,
          p2 = Submission.authors.destroyAll({ id: submissionId }).$promise,
          p3 = Submission.documents.destroyAll({ id: submissionId }).$promise;

        return $q.all([p1, p2, p3]).then(function () {
          return Submission.deleteById({ id: submissionId }).$promise;
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

      $scope.deleteSubmission = function(submissionId) {
        if (confirm("Are you sure?")) {
          deleteSubmission(submissionId).then(function() {
            SessionService.setFlash('Submission was deleted successfully!');
            $state.go($state.current, $state.params, {reload: true});
          });
        }
      };

      loadSubmissions();
    }]);
