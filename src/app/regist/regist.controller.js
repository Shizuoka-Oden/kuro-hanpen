'use strict';

angular
  .module('kuro-hanpen')
  .controller('RegistController', RegistController);

/** @ngInject */
function RegistController() {
  var vm = this;
  vm.categories = [
    "交通事故多発",
    "急な飛び出し",
    "朝夕通勤・通学",
    "その他"
  ];
}
