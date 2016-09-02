angular
  .module('app')
  .controller('StatisticsController',
    ['$q', '$scope', '$state', '$stateParams', '$http', '$timeout', 'ConferenceService', 'Submission', 'User', 'Conference', 'Review',
      function($q, $scope, $state, $stateParams, $http, $timeout, ConferenceService, Submission, User, Conference, Review) {

        $scope.submissionPromise = Submission.find(
          {filter: {where: { conferenceId: ConferenceService.getCurrentConferenceId()},
          include: {'authors': ['affiliation']}}}).$promise;

        var authorVsSubmissions = function() {
          $scope.labels = ['Submissions'];
          $scope.series = ['Authors', 'Submissions'];

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

          $scope.data = [[],[]];

          Conference.authors.count({id: ConferenceService.getCurrentConferenceId()}).$promise.then(function(result) {
            $scope.data[0].push(result.count);
          });

          Submission.count({filter: {where: { conferenceId: ConferenceService.getCurrentConferenceId()}}}).$promise.then(function(result) {
            $scope.data[1].push(result.count);
          });
        };
        authorVsSubmissions();

        var users = function() {
          $scope.labelsUser = ['Submissions'];
          $scope.seriesUser = ['Attendees', 'Authors', 'Reviewers', 'Chairs'];

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

          $scope.dataUser = [[],[], [], []];

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
        };
        users();

        var reviewsFinishedVsDraft = function() {
          $scope.reviewsLabels = ["Finished", "Open"];
          $scope.reviewsData = [];
          $scope.reviewsOptions = {
            legend: {display: true}
          };

          $scope.submissionPromise.then(function(submission) {
              var ids = submission.map(function(s) { return {submissionId: s.id}; });
              Review.find({filter: {where: { or: ids}}}).$promise.then(function(r) {
                $scope.reviewsData.push(r.filter(function(r) { return r.finished;}).length);
                $scope.reviewsData.push(r.filter(function(r) { return !r.finished;}).length);
              });
            });

        };
        reviewsFinishedVsDraft();

        var submissionsByAffs = function() {

          $scope.subAffLabels = ['Submissions'];
          $scope.submissionPromise.then(function(data) {

              var affsById = {};
              var top3 = _.pairs(_.countBy(_.flatten(data.map(function(s) {
                return s.authors.map(function(a) { affsById[a.affiliation.id] = a.affiliation; return a.affiliation});
              })), function(a) { return a.id; })).sort(function(a, b) { return b[1] - a[1]}).splice(0,3);

              $scope.subAffData = top3.map(function(a) { return [a[1]] });
              $scope.subAffSeries = top3.map(function(a) { return affsById[a[0]].name});

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
        };
        submissionsByAffs();

        var submissionStatus = function() {
          $scope.subStatusLabel = ["Draft", "Submitted", "Approved"];
          $scope.submissionPromise.then(function(data) {




            $scope.submissionPromise.then(function(s) {
              $scope.subStatusData = _.pairs(_.countBy(s.map(function(s) { return s.status; }))).sort(function(p)
                { return p[1];}).map(function(x) { return x[1];});

            });

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

          });
        }
        submissionStatus();
      }]);
