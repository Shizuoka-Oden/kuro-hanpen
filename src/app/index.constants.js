/* global malarkey:false, moment:false */
(function() {
  'use strict';

  angular
    .module('kuro-hanpen')
    .constant('malarkey', malarkey)
    .constant('moment', moment)
    .constant('apiServer', 'https://m4fgyamv41.execute-api.ap-northeast-1.amazonaws.com');

})();
