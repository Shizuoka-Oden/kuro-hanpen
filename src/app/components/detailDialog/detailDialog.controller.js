(function() {
  'use strict';

  angular
    .module('kuro-hanpen')
    .controller('DetailDialogController', DetailDialogController);

  /** @ngInject */
  function DetailDialogController($mdDialog, $document, GeoLocation, marker, Categories, GmapData) {
    var vm = this;
    vm.id = marker.model.id;
    vm.icon =  marker.model.icon;
    vm.type = marker.model.type;
    vm.address = marker.model.address;
    vm.title = marker.model.title;
    vm.description = marker.model.description;
    vm.preset = marker.model.preset;
    vm.isConfirm = false;

    // 埋め込みストリートビュー
    var latLng = {
      lat : marker.model.latitude,
      lng : marker.model.longitude
    }
    var sv = new google.maps.StreetViewService();
    sv.getPanorama({location: latLng, radius: 50}, processSVData);

    function processSVData(data, status) {
      var panorama = new google.maps.StreetViewPanorama($document[0].getElementById('pano'), {
        addressControl: false,
        zoomControl: false,
        panControl: false
      });
      if (status === google.maps.StreetViewStatus.OK) {
        panorama.setPano(data.location.pano);
        panorama.setPov({
          heading: 270,
          pitch: 0
        });
        panorama.setVisible(true);
      } else {
        panorama.setVisible(false);
        $document[0].getElementById('pano').style.display='none';
      }
    }

    if (vm.type === 'ヒヤリハット') {
      vm.type = 'ヒヤリ';
    }

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

    vm.keiro = function () {
      if (!GmapData.directionsDisplay) {
        GmapData.directionsDisplay = new google.maps.DirectionsRenderer();
      }
      GmapData.directionsDisplay.setMap(GmapData.control.getGMap());

      var directionsService = new google.maps.DirectionsService();
      var start = GmapData.current.latitude.toString() + "," + GmapData.current.longitude.toString();
      var request = {
        origin: start,
        destination: latLng,
        travelMode: google.maps.TravelMode.WALKING
      };
      directionsService.route(request, function(response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
          GmapData.directionsDisplay.setDirections(response);
        }
      });
      $mdDialog.hide();
    };
  }
})();
