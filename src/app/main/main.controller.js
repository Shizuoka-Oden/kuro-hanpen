(function() {
  'use strict';

  angular
    .module('kuro-hanpen')
    .controller('MainController', MainController);

  /** @ngInject */
  function MainController(GeoLocation) {
    var vm = this;
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
      vm.map.zoom = 14;
    }, function() {
      // 現在地を取得できない場合は静岡駅を中心地に設定
      vm.map = {
        center: {
          latitude: 34.9714699,
          longitude: 138.3869833
        },
        zoom: 14
      };
    });
  }
})();
