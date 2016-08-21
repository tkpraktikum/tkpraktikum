angular
  .module('app')
  .controller('ReviewerAssignmentController', ['$q', '$scope', '$state', 'Submission', 'Review', 'AuthService', 'Conference', 'User', '$stateParams',
    function($q, $scope, $state, Submission, Review, AuthService, Conference, User, $stateParams) {

      var isSet = function(x) {return !!x; };

      $scope.submissions = [];
      $scope.reviewer = [];
      $scope.assignedReviewer = {};

      $scope.updateReviewer = function() {
        var diff = function(a, b) {
          return a.filter(function(x) { return b.indexOf(x) === -1});
        };
        var newReviews = [];
        var removeReviews = [];
        _.keys($scope.assignedReviewer).forEach(function(k) {
          var reviewer = $scope.assignedReviewer[k].filter(isSet);
          var oldReviewer = $scope.submissions.filter(function(s) { return s.id == k})[0].reviewers;
          diff(reviewer, oldReviewer).forEach(function(r) {
            newReviews.push({
              submissionId: k,
              reviewerId: r.id
            });
          });
          diff(oldReviewer, reviewer).forEach(function(r) {
            removeReviews.push({
              submissionId: k,
              reviewerId: r.id
            });
          });
        });
        console.log(newReviews, removeReviews);
        var deleteGetFilter = {filter: { where: { or: removeReviews}}};
        $q.all([
          newReviews.map(function(r) { return Review.create(r).$promise}),
          Review.find(deleteGetFilter).$promise.then(function(r) {
            return r.map(function(r) {
              return Review.deleteById({id: r.id}).$promise
            });
          })
        ]).then(function(result) {
          console.log(result);
        });
      };

      $scope.filterValidReviewers = function() {
        var filter = function(r) {
          return _.chain(r).filter(function(r) {return r;}).uniq().value().concat([undefined]);
        };
        Object.keys($scope.assignedReviewer).forEach(function(k) {
          $scope.assignedReviewer[k] = filter($scope.assignedReviewer[k]);
        });
      };

      Conference.reviewer({id: AuthService.getCurrentConferenceId()}).$promise
        .then(function(r) {
          r = r.map(function(r) {
            r.fullName = r.firstname + ' ' + r.lastname;
            return r;
          });
          $scope.reviewer = r;

          var filter = {
            filter: {
              where: {conferenceId: AuthService.getCurrentConferenceId()},
              include: ['authors']
            }
          };
          Submission.find(filter)
            .$promise.then(function(s) {
            var ids = s.map(function(s) { return {submissionId: s.id}});
            var idFilter = {filter: { where: {or: ids}}};
            Review.find(idFilter).$promise.then(function (reviews) {
              s = s.map(function(s) {
                var reviewer = reviews.filter(function(r) { return r.submissionId == s.id}).map(function(r) { return r.reviewerId; });
                s.authors = s.authors.map(function(a) {
                  a.fullName = a.firstname + ' ' + a.lastname;
                  return a;
                });
                s.reviewers = $scope.reviewer.filter(function(r) { return reviewer.indexOf(r.id) !== -1;});
                return s;
              });
              $scope.submissions = s;
              s.forEach(function(s) {
                $scope.assignedReviewer[s.id] = s.reviewers.concat([undefined]);
              });
            });
          });
        });
  }]);
