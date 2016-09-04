angular
  .module('app')
  .controller('ReviewerAssignmentController', ['$q', '$scope', '$state', 'Submission', 'Review', 'ConferenceService', 'SessionService', 'Conference', 'User', '$stateParams',
    function($q, $scope, $state, Submission, Review, ConferenceService, SessionService, Conference, User, $stateParams) {

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
          SessionService.setFlash('Updated reviewers!')
          $state.reload();
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

      Conference.reviewer({id: ConferenceService.getCurrentConferenceId()}).$promise
        .then(function(r) {
          $scope.reviewer = r;

          var filter = {
            filter: {
              where: {conferenceId: ConferenceService.getCurrentConferenceId()},
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

      function shuffleArray(array) {
        for (var i = array.length - 1; i > 0; i--) {
          var j = Math.floor(Math.random() * (i + 1));
          var temp = array[i];
          array[i] = array[j];
          array[j] = temp;
        }
        return array;
      }

      $scope.doAutoAssignment = function(count) {
        var proposedReviewer = {};
        var submissions = $scope.submissions.map(function(s) {
          proposedReviewer[s.id] = [];
          return {
            id: s.id,
            authors: s.authors.map(function(a) {return a.id})
          }
        });
        var reviewer = $scope.reviewer.map(function(r) { return r.id});
        var reviewerTaskCount = {};
        reviewer.forEach(function(r) {
          reviewerTaskCount[r] = 0;
        });

        var currentMax = parseInt((submissions.length * count) / reviewer.length, 10) + 1;
        for(var i=0; i < count; i++) {
          submissions.forEach(function (s) {
            var tempMax = currentMax;
            while(!found) {
              var found = false;
              var localReviewer = shuffleArray(reviewer);
              for (var j = 0; j < localReviewer.length; j++) {
                var r = localReviewer[j];
                if (reviewerTaskCount[r] < currentMax) {
                  if (s.authors.indexOf(r) === -1 && proposedReviewer[s.id].indexOf(r) === -1) {
                    reviewerTaskCount[r]++;
                    proposedReviewer[s.id].push(r);
                    found = true;
                    break;
                  }
                }
              }
              if (!found) {
                tempMax += 1;
                if (tempMax >= currentMax * 2) {
                  found = true; // break;
                }
              }
            }
          });
        }

        _.keys(proposedReviewer).forEach(function(k) {
          proposedReviewer[k] = proposedReviewer[k].map(function(rId) {
            return $scope.reviewer.filter(function(r) { return r.id === rId})[0]
          });
        });

        $scope.assignedReviewer = proposedReviewer;
        $scope.filterValidReviewers();

      };
  }]);
