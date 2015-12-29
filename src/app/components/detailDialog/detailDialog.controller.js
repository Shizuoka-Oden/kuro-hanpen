(function() {
  'use strict';

  angular
    .module('kuro-hanpen')
    .controller('DetailDialogController', DetailDialogController);

  /** @ngInject */
  function DetailDialogController($mdDialog, GeoLocation, marker) {
    var vm = this;
    vm.id = marker.model.id;
    vm.icon =  marker.model.icon;
    vm.latitude = marker.model.latitude;
    vm.longitude = marker.model.longitude;
    vm.type = marker.model.type;
    vm.address = marker.model.address;
    vm.title = marker.model.title;
    vm.description = marker.model.description;
    vm.preset = marker.model.preset;
    vm.isConfirm = false;

    vm.hide = function() {
      $mdDialog.hide();
    };
    vm.cancel = function() {
      $mdDialog.cancel();
    };

    vm.deleteConfirm = function() {
      vm.isConfirm = true;
    };
    vm.delete = function() {
      GeoLocation.delete(vm.id)
      .finally(function (response) {
        marker.setMap(null);
        $mdDialog.hide();
      });
    };
  }
})();
