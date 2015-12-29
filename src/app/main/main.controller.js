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

    vm.showRegistDialog = function(ev) {
       var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && vm.customFullscreen;
       $mdDialog.show({
         controller: 'RegistController',
         controllerAs: 'regist',
         templateUrl: 'app/regist/regist.tmpl.html',
         targetEvent: ev,
         clickOutsideToClose:true,
         fullscreen: useFullScreen
       });
     };
  }
})();
