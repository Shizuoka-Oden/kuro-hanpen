(function() {
  'use strict';

  angular
    .module('kuro-hanpen')
    .factory('GmapData', GmapData);

  /** @ngInject */
  function GmapData() {
    // 航空写真との切り替えやストリートビューの切り替えは無効
    return {
      control: {},
      zoom: 14,
      options: {
        mapTypeControl: false,
        streetViewControl: false,
        zoomControl: false
      }
    };
  }
})();
