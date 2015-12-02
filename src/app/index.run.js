(function() {
  'use strict';

  angular
    .module('kuro-hanpen')
    .run(runBlock);

  /** @ngInject */
  function runBlock($log) {

    $log.debug('runBlock end');
  }

})();
