(function() {
  'use strict';

  angular
    .module('kuro-hanpen')
    .controller('MainController', MainController);

  /** @ngInject */
  function MainController(Categories, $mdSidenav, $mdMedia, $mdDialog) {
    var vm = this;

    vm.toggleSideMenu = function() {
      $mdSidenav('left').toggle();
    };

    vm.categories = Categories;

    vm.showDetailDialog = function(ev) {
      var useFullScreen = $mdMedia('sm') || $mdMedia('xs');
      $mdDialog.show({
        controller: 'DetailDialogController',
        controllerAs: 'detailDialog',
        templateUrl: 'app/components/detailDialog/detailDialog.tmpl.html',
        targetEvent: ev,
        clickOutsideToClose: true,
        fullscreen: useFullScreen,
        locals: {
          marker: ev
        }
      });
    };

    vm.showUserDialog = function(ev) {
      var useFullScreen = $mdMedia('sm') || $mdMedia('xs');
      $mdDialog.show({
        controller: 'UserDialogController',
        controllerAs: 'userDialog',
        templateUrl: 'app/components/userDialog/userDialog.tmpl.html',
        targetEvent: ev,
        clickOutsideToClose: true,
        fullscreen: useFullScreen
      });
    };

    vm.showTrendingDialog = function(ev) {
      var useFullScreen = $mdMedia('sm') || $mdMedia('xs');
      $mdDialog.show({
        controller: 'TrendingDialogController',
        controllerAs: 'trendingDialog',
        templateUrl: 'app/components/trendingDialog/trendingDialog.tmpl.html',
        targetEvent: ev,
        clickOutsideToClose: true,
        fullscreen: useFullScreen
      });
    };
  }
})();
