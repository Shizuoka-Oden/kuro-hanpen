(function() {
  'use strict';

  var gmapData = {
    // 航空写真との切り替えやストリートビューの切り替えは無効
    // 現在地を取得できない場合は静岡駅を中心地に設定
    control: {},
    zoom: 14,
    options: {
      mapTypeControl: false,
      streetViewControl: false,
      zoomControl: false
    }
  };

  angular
    .module('kuro-hanpen')
    .constant('GmapData', gmapData);
})();
