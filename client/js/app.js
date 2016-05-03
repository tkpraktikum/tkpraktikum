angular
  .module('app', [
    'lbServices',
    'ui.router'
  ])
  .config(['$stateProvider', '$urlRouterProvider', function($stateProvider,
                                                            $urlRouterProvider) {
    $stateProvider
      .state('tag', {
        url: '',
        templateUrl: 'views/tag.html',
        controller: 'TagController'
      });

    $urlRouterProvider.otherwise('tag');
  }]);
