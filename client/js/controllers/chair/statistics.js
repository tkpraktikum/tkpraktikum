angular
  .module('app')
  .controller('StatisticsController',
    ['$q', '$scope', '$state', '$stateParams', '$http', '$timeout', 'ConferenceService', 'Submission', 'User', 'Conference', 'Review',
      function($q, $scope, $state, $stateParams, $http, $timeout, ConferenceService, Submission, User, Conference, Review) {

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

        var reviewsFinishedVsDraft = function() {
          $scope.reviewsLabels = ["Finished", "Open"];
          $scope.reviewsData = [];
          $scope.reviewsOptions = {
            legend: {display: true}
          };

          Submission.find({filter: {where: { conferenceId: ConferenceService.getCurrentConferenceId()}}}).$promise
            .then(function(submission) {
              var ids = submission.map(function(s) { return {submissionId: s.id}; });
              Review.find({filter: {where: { or: ids}}}).$promise.then(function(r) {
                $scope.reviewsData.push(r.filter(function(r) { return r.finished;}).length);
                $scope.reviewsData.push(r.filter(function(r) { return !r.finished;}).length);
              });
            });

        };
        reviewsFinishedVsDraft();

        $scope.reviewsTimeLabels = ["January", "February", "March", "April", "May", "June", "July", "August", "September"];
        $scope.reviewsTimeSeries = ['Series A'];
        $scope.reviewsTimeData = [
          [5, 8, 13, 20, 40, 80, 100, 106, 110]
        ];

        $scope.reviewsTimeOptions = {
          scales: {
            yAxes: [{
              display: true,
              ticks: {
                suggestedMin: 0
              }
            }]
          }
        };

        $scope.subAffLabels = ['Submissions'];
        $scope.subAffSeries = ['TUD', 'KIT', 'MIT', 'DHBW', 'SF'];

        $scope.subAffOptions = {
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

        $scope.subAffData = [
          [100],
          [70],
          [120],
          [60],
          [150]
        ];
      }]);
