angular
  .module('app')
  .controller('ReviewOverviewController', ['$scope', '$state', 'Review', 'AuthService', 'User', '$stateParams',
    function($scope, $state, Review, AuthService, User, $stateParams) {

      $scope.submissions = [
        {
          title: 'From the Cloud to the Atmosphere: Running MapReduce across Datacenters',
          tags: ['big-data', 'geo-distribued', 'map-reduce', 'datacenter']
        },{
          title: 'Big Data Analytics beyond the Datacenter',
          tags: ['big-data', 'analytics', 'map-reduce']
        },{title: 'Efficient Geo-Distributed Data Processing with Rout',
          tags: ['big-data', 'rout', 'geo-db']
        },
      ]

    }]);
