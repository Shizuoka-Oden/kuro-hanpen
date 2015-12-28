(function() {
  'use strict';

  angular
    .module('kuro-hanpen')
    .controller('DetailDialogController', DetailDialogController);

  /** @ngInject */
  function DetailDialogController($mdDialog, location) {
    var vm = this;
    vm.id = location.id;
    vm.icon =  location.icon;
    vm.latitude = location.latitude;
    vm.longitude = location.longitude;
    vm.type = location.type;
    vm.address = location.address;
    vm.title = location.title;
    vm.description = location.description;

    vm.hide = function() {
      $mdDialog.hide();
    };
    vm.cancel = function() {
      $mdDialog.cancel();
    };
  }
})();
