angular
  .module('app')
  .controller('ReviewCreateController', ['$scope', '$state', 'Review', 'AuthService', 'User', '$stateParams',
    function($scope, $state, Review, AuthService, User, $stateParams) {

      $scope.submission = {
        abstract: "**Abstract** Efficiently analyzing big data is a major issue in our current era. Examples of analysis tasks include identification or detection of global weather patterns, economic changes, social phenomena, or epidemics.\n\n" +
                    "The cloud *computing* paradigm along **with** software tools such as implementations of the popular MapReduce framework offer a response to the problem, by distributing computations among large sets of nodes. In many scenarios input data is geographically distributed (geo-distributed) across datacenters, and straightforwardly moving all data to a single datacenter before processing it can be not only unnecessary but also prohibitively expensive, but the above-mentioned tools are designed to work within a single cluster or datacenter and perform poorly or not at all when deployed across datacenters. \n\n" +
                    "This paper deals with executing **sequences of MapReduce** jobs on geo-distributed datasets. We analyze possible ways of executing such jobs, and propose data transformation graphs that can be used to determine schedules for job sequences which are optimized either with respect to execution time or monetary cost. We introduce G-MR, a system for executing such job sequences, which implements our optimization framework. We present empirical evidence in Amazon EC2 and VICCI of the benefits of G-MR over common, na ̈ıve deployments for processing geo-distributed datasets. Our evaluations show that using G-MR significantly improves processing time and cost for geo-distributed datasets.",
        title: "From the Cloud to the Atmosphere: Running MapReduce across Datacenters"
      };


      var hideIcons = ["guide", "fullscreen", "side-by-side"];
      $scope.reviewStrongEditor = new SimpleMDE({ hideIcons: hideIcons, element: document.getElementById("reviewStrong") });
      $scope.reviewWeakEditor = new SimpleMDE({ hideIcons: hideIcons, element: document.getElementById("reviewWeak") });
      $scope.reviewSummaryEditor = new SimpleMDE({ hideIcons: hideIcons, element: document.getElementById("reviewSummary") });
      $scope.reviewDetailedEditor = new SimpleMDE({ hideIcons: hideIcons, element: document.getElementById("reviewDetailed") });
    }]);
