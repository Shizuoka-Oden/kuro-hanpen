(function() {
  'use strict';

  angular
    .module('kuro-hanpen')
    .controller('TrendingDialogController', TrendingDialogController);

  /** @ngInject */
  function TrendingDialogController($mdDialog, $mdMedia, $http, apiServer) {
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

    vm.goToDetailsDialog = function(data) {
      vm.hide();
      data.latitude = data.location.lat;
      data.longitude = data.location.lon;
      data.disableDelete = true;

      var useFullScreen = $mdMedia('sm') || $mdMedia('xs');
      $mdDialog.show({
        controller: 'DetailDialogController',
        controllerAs: 'detailDialog',
        templateUrl: 'app/components/detailDialog/detailDialog.tmpl.html',
        clickOutsideToClose: true,
        fullscreen: useFullScreen,
        locals: {
          marker: {
            model: data
          }
        }
      });
    }
  }
})();
