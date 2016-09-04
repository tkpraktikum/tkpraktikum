angular
  .module('app')
  .controller('StatisticsController',
      ['$q', '$scope', '$state', 'ConferenceService', 'Submission', 'Conference', 'Review', 'SubmissionStatus',
      function($q, $scope, $state, ConferenceService, Submission, Conference, Review, SubmissionStatus) {
    var submissionPromise = Submission.find(
        {filter: {where: { conferenceId: ConferenceService.getCurrentConferenceId()},
        include: {'authors': ['affiliation']}}}).$promise,
      authorVsSubmissions = function() {
        $scope.labels = ['Submissions'];
        $scope.series = ['Authors', 'Submissions'];
        $scope.data = [[], []];

        $scope.options = {
          legend: {display: true},
          scales : {
            yAxes: [{
              display: true,
              ticks: {
                suggestedMin: 0
              }
            }]
          }
        };

        Conference.authors.count({id: ConferenceService.getCurrentConferenceId()}).$promise.then(function(result) {
          $scope.data[0].push(result.count);
        });

        Submission.count({filter: {where: { conferenceId: ConferenceService.getCurrentConferenceId()}}}).$promise.then(function(result) {
          $scope.data[1].push(result.count);
        });
      },
      users = function() {
        $scope.labelsUser = ['Submissions'];
        $scope.seriesUser = ['Attendees', 'Authors', 'Reviewers', 'Chairs'];
        $scope.dataUser = [[], [], [], []];

        $scope.optionsUser = {
          legend: {display: true},
          scales : {
            yAxes: [{
              display: true,
              ticks: {
                suggestedMin: 0
              }
            }]
          }
        };

        Conference.authors.count({id: ConferenceService.getCurrentConferenceId()}).$promise.then(function(result) {
          $scope.dataUser[0].push(result.count);
        });

        Conference.attendees.count({id: ConferenceService.getCurrentConferenceId()}).$promise.then(function(result) {
          $scope.dataUser[1].push(result.count);
        });

        Conference.reviewer.count({id: ConferenceService.getCurrentConferenceId()}).$promise.then(function(result) {
          $scope.dataUser[2].push(result.count);
        });

        Conference.chairs.count({id: ConferenceService.getCurrentConferenceId()}).$promise.then(function(result) {
          $scope.dataUser[3].push(result.count);
        });
      },
      reviewsFinishedVsDraft = function() {
        $scope.reviewsLabels = ["Finished", "Open"];
        $scope.reviewsData = [];
        $scope.reviewsOptions = {
          legend: {display: true}
        };

        submissionPromise.then(function(submission) {
          var ids = submission.map(function(s) { return {submissionId: s.id}; });
          Review.find({filter: {where: { or: ids }}}).$promise.then(function(r) {
            $scope.reviewsData.push(r.filter(function(r) { return r.finished;}).length);
            $scope.reviewsData.push(r.filter(function(r) { return !r.finished;}).length);
          });
        });
      },
      submissionsByAffs = function() {
        $scope.subAffLabels = ['Submissions'];
        submissionPromise.then(function(data) {

          var affsById = {};
          var top3 = _.pairs(_.countBy(_.flatten(data.map(function(s) {
            return s.authors.map(function(a) { affsById[a.affiliation.id] = a.affiliation; return a.affiliation});
          })), function(a) { return a.id; })).sort(function(a, b) { return b[1] - a[1]}).splice(0,3);

          $scope.subAffData = top3.map(function(a) { return [a[1]] });
          $scope.subAffSeries = top3.map(function(a) { return affsById[a[0]].name.split(", ")[0]; });

          $scope.subAffOptions = {
            legend: {display: true},
            scales: {
              yAxes: [{
                display: true,
                ticks: {
                  suggestedMin: 0
                }
              }]
            }
          };
      });
    },
    submissionStatus = function() {
      $scope.subStatusLabel = ["Draft", "Final", "Approved"];
      $scope.subStatusOptions = {
        legend: {display: true},
        scales: {
          yAxes: [{
            display: true,
            ticks: {
              suggestedMin: 0
            }
          }]
        }
      };

      submissionPromise.then(function(s) {
        var defaults = { 0: 0, 1: 0, 2: 0 };
        $scope.subStatusData = _.chain(
            _.countBy(s.map(function(s) {
              return (s.status & SubmissionStatus.Approved) ? 2 :
                    ((s.status & SubmissionStatus.Final)    ? 1 : 0);
            }))
          )
          .defaults(defaults)
          .values()
          .value();
      });
    }

    authorVsSubmissions();
    users();
    reviewsFinishedVsDraft();
    submissionsByAffs();
    submissionStatus();
  }]);
