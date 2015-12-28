(function() {
  'use strict';

  angular
    .module('kuro-hanpen')
    .controller('MainController', MainController);

  /** @ngInject */
  function MainController(GeoLocation, FilterLocation, $mdSidenav, $mdMedia, $mdDialog, $document) {
    var vm = this;
    vm.filters = FilterLocation.getFilters();

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

    GeoLocation.getMarkers('保育園').then(function(markers) {
      vm.nurseySchoolMarkers = convertMarkersResponse(markers);
    });
    GeoLocation.getMarkers('幼稚園').then(function(markers) {
      vm.kindergartenMarkers = convertMarkersResponse(markers);
    });
    GeoLocation.getMarkers('小学校').then(function(markers) {
      vm.primarySchoolMarkers = convertMarkersResponse(markers);
    });
    GeoLocation.getMarkers('中学校').then(function(markers) {
      vm.juniorHighSchoolMarkers = convertMarkersResponse(markers);
    });
    GeoLocation.getMarkers('高校').then(function(markers) {
      vm.highSchoolMarkers = convertMarkersResponse(markers);
    });
    GeoLocation.getMarkers('公園').then(function(markers) {
      vm.parkMarkers = convertMarkersResponse(markers);
    });
    GeoLocation.getMarkers('ヒヤリハット').then(function(markers) {
      vm.incidentMarkers = convertMarkersResponse(markers);
    });

    vm.toggleSideMenu = function() {
      $mdSidenav('left').toggle();
    };

    vm.showDetailDialog = function(ev) {
       var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && vm.customFullscreen;
       console.log(ev);
       $mdDialog.show({
          controller: 'DetailDialogController',
          controllerAs: 'detailDialog',
          templateUrl: 'app/components/detailDialog/detailDialog.tmpl.html',
          parent: angular.element($document.body),
          targetEvent: ev,
          clickOutsideToClose: true,
          fullscreen: useFullScreen,
          locals: {
            location: ev.model
          }
       });
     };
  }

  function convertMarkersResponse(markers) {
    return markers.map(function(marker) {
      return {
        id: marker._id,
        icon: getIcon(marker.type),
        latitude: marker.location.lat,
        longitude: marker.location.lon,
        type: marker.type,
        address: marker.address,
        title: marker.title,
        description: marker.description
      };
    });
  }
  // TODO: どっか追い出す
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
