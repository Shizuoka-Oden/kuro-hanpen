(function() {
  'use strict';

  angular
    .module('kuro-hanpen')
    .controller('MainController', MainController);

  /** @ngInject */
  function MainController(GeoLocation) {
    var vm = this;
    vm.zoom = 14;
    // 航空写真との切り替えやストリートビューの切り替えは無効
    vm.options = {
      mapTypeControl: false,
      streetViewControl: false,
      zoomControl: false
    };

    vm.map = {};

    GeoLocation.getCurrent().then(function(location) {
      vm.map.center = {
        latitude: location.lat,
        longitude: location.lon
      };
    }, function() {
      // 現在地を取得できない場合は静岡駅を中心地に設定
      vm.map = {
        center: {
          latitude: 34.9714699,
          longitude: 138.3869833
        }
      };
    });

    GeoLocation.getMarkers().then(function(markers) {
      vm.markers = markers.map(function(marker) {
        var icon = getIcon(marker.type);
        return {
          id: marker._id,
          icon: icon,
          latitude: marker.location.lat,
          longitude: marker.location.lon
        };
      });
    });
  }

  function getIcon(type) {
    switch(type) {
    case '幼稚園':
      return 'assets/images/kindergarten.png';
    case '保育園':
      return 'assets/images/nursery-school.png';
    case '小学校':
      return 'assets/images/primary-school.png';
    case '中学校':
      return 'assets/images/junior-high-school.png';
    case '高校':
      return 'assets/images/high-school.png';
    case '公園':
      return 'assets/images/park.png';
    case 'ヒヤリハット':
      return 'assets/images/incident.png';
    }
    return '';
  }
})();
