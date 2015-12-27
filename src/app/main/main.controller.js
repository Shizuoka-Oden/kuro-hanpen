(function() {
  'use strict';

  angular
    .module('kuro-hanpen')
    .controller('MainController', MainController);

  /** @ngInject */
  function MainController(GeoLocation, $mdSidenav) {
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

    var categories = [{
      name: '保育園',
      icon: 'assets/images/nursery-school.png',
      display: true,
      markers: []
    }, {
      name: '幼稚園',
      icon: 'assets/images/kindergarten.png',
      display: true,
      markers: []
    }, {
      name: '小学校',
      icon: 'assets/images/primary-school.png',
      display: true,
      markers: []
    }, {
      name: '中学校',
      icon: 'assets/images/junior-high-school.png',
      display: true,
      markers: []
    }, {
      name: '高校',
      icon: 'assets/images/high-school.png',
      display: true,
      markers: []
    }, {
      name: '公園',
      icon: 'assets/images/park.png',
      display: true,
      markers: []
    }, {
      name: 'ヒヤリハット',
      icon: 'assets/images/incident.png',
      display: true,
      markers: []
    }];

    vm.categories = categories;
    categories.forEach(function(category) {
      GeoLocation.getMarkers(category.name)
        .then(function(markers) {
          category.markers = convertMarkersResponse(markers, category);
      });
    });

    vm.toggleSideMenu = function() {
      $mdSidenav('left').toggle();
    };
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
