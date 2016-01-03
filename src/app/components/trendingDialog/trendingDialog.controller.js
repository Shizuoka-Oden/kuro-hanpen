(function() {
  'use strict';

  angular
    .module('kuro-hanpen')
    .controller('TrendingDialogController', TrendingDialogController);

  /** @ngInject */
  function TrendingDialogController($mdDialog, $http, apiServer) {
    var vm = this;

    vm.hide = function() {
      $mdDialog.hide();
    };

    vm.cancel = function() {
      $mdDialog.cancel();
    };

    $http.get(apiServer + '/production/regnumranking')
    .then(function(response) {
      vm.ragnumData = response.data;
    });

    $http.get(apiServer + '/production/location?type=ヒヤリハット&sort=likesCount')
    .then(function(response) {
      vm.shareData = response.data.results;
    });
  }
})();
