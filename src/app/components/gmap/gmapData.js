(function() {
  'use strict';

  var gmapData = {
    control: {},
    zoom: 14
  };

  angular
    .module('kuro-hanpen')
    .value('GmapData', gmapData);
})();
