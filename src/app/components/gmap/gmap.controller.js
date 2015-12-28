(function() {
  'use strict';

  angular
    .module('kuro-hanpen')
    .controller('GMapController', GMapController);

  /** @ngInject */
  function GMapController(GeoLocation, $scope) {
    var vm = this;

    vm.zoom = 14;
    // 航空写真との切り替えやストリートビューの切り替えは無効
    vm.options = {
      mapTypeControl: false,
      streetViewControl: false,
      zoomControl: false
    };

    GeoLocation.getCurrent().then(function(location) {
      vm.center = {
        latitude: location.lat,
        longitude: location.lon
      };
    }, function() {
      // 現在地を取得できない場合は静岡駅を中心地に設定
      vm.center = {
        latitude: 34.9714699,
        longitude: 138.3869833
      };
    });

    $scope.main.categories.forEach(function(category) {
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
        longitude: marker.location.lon
      };
    });
  }

})();
