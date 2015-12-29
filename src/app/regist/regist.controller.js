'use strict';

angular
  .module('kuro-hanpen')
  .controller('RegistController', RegistController);

/** @ngInject */
function RegistController($mdDialog, GeoLocation, $log) {
  var vm = this;
  vm.categories = [
    "交通事故多発",
    "急な飛び出し",
    "朝夕通勤・通学",
    "その他"
  ];

  GeoLocation.getCurrent().then(
    function(location) {
      vm.location = {
        latitude: location.lat,
        longitude: location.lon
      };
    },
    function() {
      vm.location = {
        latitude: 34.9714699,
        longitude: 138.3869833
      };
    });


  vm.cancel = function() {
    $mdDialog.cancel();
  };

  vm.regist = function() {
    var data = {
      "type": "ヒヤリハット",
      "address": "富士市松本326-7",
      "location": vm.location,
      "title": "狂犬注意",
      "description": "むかしむかしあるところにおじいさんとおばあさんがなかよくくらしていました。"
    };
    GeoLocation.regist(data)
      .then(function(result) {
        $log.log(result);
        $mdDialog.hide();
      },
      function(reason) {
        $log.log(reason);
      });
  };
}
