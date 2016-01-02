'use strict';

angular
  .module('kuro-hanpen')
  .value('hiyaloco', {
    type: 'ヒヤリハット',
    address: '',
    location: {},
    title: '交通事故多発',
    description: ''
  })
  .controller('RegistController', RegistController);

/** @ngInject */
function RegistController($mdDialog, GeoLocation, $log, Gmap, Categories, hiyaloco, location) {
  var vm = this;
  vm.titles = [
    '交通事故多発',
    '急な飛び出し',
    '朝夕通勤・通学',
    'その他'
  ];
  vm.hiyaloco = hiyaloco;

  vm.hiyaloco.address = '';
  vm.hiyaloco.title = '交通事故多発';
  vm.hiyaloco.description = '';

  if (location) {
    vm.hiyaloco.location = {
      lat: location.lat,
      lon: location.lng
    };
    vm.hiyaloco.address = location.address;
  }

  var icon = Categories[Categories.length - 1].icon;
  var convertDataToMarker = function(data) {
    return {
      id: data._id,
      icon: icon,
      latitude: data.location.lat,
      longitude: data.location.lon,
      type: data.type,
      address: data.address,
      title: data.title,
      description: data.description,
      likes: [],
      preset: data.preset
    };
  };

  vm.cancel = function() {
    $mdDialog.cancel();
  };

  vm.regist = function() {
    GeoLocation.regist(vm.hiyaloco)
      .then(function(result) {
        $log.log(result);
        Gmap.addLocationToMarkers(convertDataToMarker(result.data));
        $mdDialog.hide();
      },
      function(reason) {
        $log.error(reason);
      });
  };
}
