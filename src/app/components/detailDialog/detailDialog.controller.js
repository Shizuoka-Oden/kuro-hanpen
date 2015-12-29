(function() {
  'use strict';

  angular
    .module('kuro-hanpen')
    .controller('DetailDialogController', DetailDialogController);

  /** @ngInject */
  function DetailDialogController($mdDialog, GeoLocation, marker, Gmap) {
    var vm = this;
    vm.id = marker.model.id;
    vm.icon =  marker.model.icon;
    vm.type = marker.model.type;
    vm.address = marker.model.address;
    vm.title = marker.model.title;
    vm.description = marker.model.description;
    vm.preset = marker.model.preset;
    vm.isConfirm = false;
    // 表示名を短くする
    if (vm.type === 'ヒヤリハット') {
      vm.type = 'ヒヤリ';
    }

    // 埋め込みストリートビュー表示
    var latLng = {
      lat : marker.model.latitude,
      lng : marker.model.longitude
    };
    Gmap.setStreetView(latLng, 'pano');

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
      Gmap.deleteLocationFromMarkers(vm.id);
      GeoLocation.delete(vm.id)
      .finally(function () {
        marker.setMap(null);
        $mdDialog.hide();
      });
    };

    vm.route = function () {
      Gmap.setRoute(latLng);
      $mdDialog.hide();
    };
  }
})();
