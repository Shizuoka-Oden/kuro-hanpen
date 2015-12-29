(function() {
  'use strict';

  angular
    .module('kuro-hanpen')
    .controller('GMapController', GMapController);

  /** @ngInject */
  function GMapController(GeoLocation, Categories, GmapData) {
    var vm = this;
    vm.gmapData = GmapData;
    GeoLocation.getCurrent().then(function(location) {
      vm.gmapData.center = {
        latitude: location.lat,
        longitude: location.lon
      };
      vm.gmapData.current = {
        latitude: location.lat,
        longitude: location.lon
      };
    }, function() {
      // 現在地を取得できない場合は静岡駅を中心地に設定
      vm.gmapData.center = {
        latitude: 34.9714699,
        longitude: 138.3869833
      };
    });

    Categories.forEach(function(category) {
      GeoLocation.getMarkers(category.name)
        .then(function(markers) {
          category.markers = convertMarkersResponse(markers, category);
      });
    });
  }

  function convertMarkersResponse(markers, category) {
    return markers.map(function(marker) {
      return {
        id: marker._id,
        icon: category.icon,
        latitude: marker.location.lat,
        longitude: marker.location.lon,
        type: marker.type,
        address: marker.address,
        title: marker.title,
        description: marker.description,
        preset: marker.preset
      };
    });
  }
})();
