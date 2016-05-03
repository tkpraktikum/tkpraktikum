angular
  .module('app', [
    'lbServices',
    'ui.router'
  ])
  .config(['$stateProvider', '$urlRouterProvider', function($stateProvider,
                                                            $urlRouterProvider) {
    $stateProvider
      .state('tag', {
        url: '/tag',
        templateUrl: 'views/tag.html',
        controller: 'TagController'
      })
      .state('affiliation', {
        url: '/affiliation',
        templateUrl: 'views/affiliation.html',
        controller: 'AffiliationController'
      });

    $urlRouterProvider.otherwise('tag');
  }]);
