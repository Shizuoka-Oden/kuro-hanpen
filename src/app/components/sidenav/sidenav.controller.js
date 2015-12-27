(function() {
  'use strict';

  angular
    .module('kuro-hanpen')
    .controller('SidenavController', SidenavController);

  /** @ngInject */
  function SidenavController($mdSidenav) {
    var vm = this;
    vm.toggleSideMenu = function() {
      $mdSidenav('left').toggle();
    };
  }
})();
