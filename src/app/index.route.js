(function() {
  'use strict';

  angular
    .module('kuro-hanpen')
    .config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('home', {
        url: '/',
        views: {
          '': {
            templateUrl: 'app/main/main.html',
            controller: 'MainController',
            controllerAs: 'main'
          },
          'sidenav@home': {
            templateUrl: 'app/components/sidenav/sidenav.html',
            controller: 'SidenavController',
            controllerAs: 'sidenav'
          },
          'gmap@home': {
            templateUrl: 'app/components/gmap/gmap.html',
            controller: 'GMapController',
            controllerAs: 'gmap'
          }
        }
      });

    $urlRouterProvider.otherwise('/');
  }

})();
