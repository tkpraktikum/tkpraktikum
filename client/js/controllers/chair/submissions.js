angular
  .module('app')
  .controller('SubmissionsChairController', ['$scope', '$state', 'Review', 'AuthService', 'User', '$stateParams',
    function($scope, $state, Review, AuthService, User, $stateParams) {
      $scope.submissions = [
        {
          title: 'From the Cloud to the Atmosphere: Running MapReduce across Datacenters',
          authors: ['Charlie, Chair', 'Borger, Anton', 'Mustermann, Max'],
          tags: ['HTML', 'HTML5', 'WebDevelopment', 'AngularJs'],
          reviewer: ['Abc']
        },
        {
          title: 'Big Data Analytics beyond the Datacenter',
          authors: ['Charlie, Chair', 'Borger, Anton', 'Mustermann, Max'],
          tags: ['HTML', 'HTML5', 'WebDevelopment', 'AngularJs'],
          reviewer: ['Abc']
        },
        {
          title: 'Efficient Geo-Distributed Data Processing with Rout',
          authors: ['Charlie, Chair', 'Borger, Anton', 'Mustermann, Max'],
          tags: ['HTML', 'HTML5', 'WebDevelopment', 'AngularJs'],
          reviewer: ['Abc']
        },
        {
          title: 'Efficient Geo-Distributed Data Processing with Rout',
          authors: ['Charlie, Chair', 'Borger, Anton', 'Mustermann, Max'],
          tags: ['HTML', 'HTML5', 'WebDevelopment', 'AngularJs'],
          reviewer: ['Abc']
        },
        {
          title: 'From the Cloud to the Atmosphere: Running MapReduce across Datacenters',
          authors: ['Charlie, Chair', 'Borger, Anton', 'Mustermann, Max'],
          tags: ['HTML', 'HTML5', 'WebDevelopment', 'AngularJs'],
          reviewer: ['Abc']
        },
        {
          title: 'Big Data Analytics beyond the Datacenter',
          authors: ['Charlie, Chair', 'Borger, Anton', 'Mustermann, Max'],
          tags: ['HTML', 'HTML5', 'WebDevelopment', 'AngularJs'],
          reviewer: ['Abc']
        },
      ];
    }]);
