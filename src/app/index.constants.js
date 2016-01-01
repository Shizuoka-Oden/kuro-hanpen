/* global malarkey:false, moment:false */
(function() {
  'use strict';

  angular
    .module('kuro-hanpen')
    .constant('malarkey', malarkey)
    .constant('moment', moment)
    .constant('apiServer', 'https://m4fgyamv41.execute-api.ap-northeast-1.amazonaws.com')
    .constant('awsRegion', 'ap-northeast-1')
    .constant('identityPoolKurohanpenId', 'ap-northeast-1:672031f5-266b-422d-99c6-cf401929abe6');

})();
