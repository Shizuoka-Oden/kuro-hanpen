'use strict';

angular
  .module('kuro-hanpen')
  .controller('RegistController', RegistController);

/** @ngInject */
function RegistController($mdDialog) {
  var vm = this;
  vm.categories = [
    "交通事故多発",
    "急な飛び出し",
    "朝夕通勤・通学",
    "その他"
  ];

  vm.cancel = function() {
    $mdDialog.cancel();
  };
  vm.regist = function() {
    $mdDialog.hide();
  };
}
