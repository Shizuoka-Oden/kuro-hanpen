(function() {
  'use strict';

  angular
    .module('kuro-hanpen')
    .config(config);

  /** @ngInject */
  function config($logProvider, toastrConfig, uiGmapGoogleMapApiProvider) {
    // Enable log
    $logProvider.debugEnabled(true);

    // Set options third-party lib
    toastrConfig.allowHtml = true;
    toastrConfig.timeOut = 3000;
    toastrConfig.positionClass = 'toast-top-right';
    toastrConfig.preventDuplicates = true;
    toastrConfig.progressBar = true;

    // Set Angular Google Maps Settings
    uiGmapGoogleMapApiProvider.v = '3.20'
    uiGmapGoogleMapApiProvider.libraries = 'weather,geometry,visualization'
  }
})();
