angular
  .module('app')
  .controller('StatisticsController',
    ['$q', '$scope', '$state', '$stateParams', '$http', '$timeout', 'AuthService', 'User', 'Conference',
      function($q, $scope, $state, $stateParams, $http, $timeout, AuthService, User, Conference) {
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

        $scope.data = [
          [100],
          [70]
        ];

        $scope.reviewsLabels = ["Finished", "Open"];
        $scope.reviewsData = [270, 30];
        $scope.reviewsOptions = {
          legend: {display: true}
        };

        $scope.reviewsTimeLabels = ["January", "February", "March", "April", "May", "June", "July", "August", "September"];
        $scope.reviewsTimeSeries = ['Series A'];
        $scope.reviewsTimeData = [
          [5, 8, 13, 20, 40, 80, 100, 106, 110]
        ];

        $scope.reviewsTimeOptions = {
          scales : {
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
