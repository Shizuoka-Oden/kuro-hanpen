(function() {
  'use strict';

  angular
    .module('kuro-hanpen')
    .controller('DetailDialogController', DetailDialogController);

  /** @ngInject */
  function DetailDialogController($mdDialog, GeoLocation, marker, Categories) {
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
      // ヒヤリハットカテゴリのマーカーから対象データを削除
      var markers = Categories[Categories.length-1].markers;
      for (var i = 0; i <= markers.length; i++) {
        if (markers[i].id === vm.id) {
          markers.splice( i , 1 );
          break;
        }
      }

      GeoLocation.delete(vm.id)
      .finally(function () {
        marker.setMap(null);
        $mdDialog.hide();
      });
    };
  }
})();
