(function() {
  'use strict';

  angular
    .module('kuro-hanpen')
    .controller('UsageDialogController', UsageDialogController);

  /** @ngInject */
  function UsageDialogController($mdDialog) {
    var vm = this;

    vm.hide = function() {
      $mdDialog.hide();
    };

    vm.cancel = function() {
      $mdDialog.cancel();
    };

  }
})();
