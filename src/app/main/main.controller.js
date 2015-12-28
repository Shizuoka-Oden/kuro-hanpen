(function() {
  'use strict';

  angular
    .module('kuro-hanpen')
    .controller('MainController', MainController);

  /** @ngInject */
  function MainController($mdSidenav, $mdMedia, $mdDialog, $document) {
    var vm = this;

    vm.toggleSideMenu = function() {
      $mdSidenav('left').toggle();
    };

    var categories = [{
      name: '保育園',
      icon: 'assets/images/nursery-school.png',
      display: true,
      markers: []
    }, {
      name: '幼稚園',
      icon: 'assets/images/kindergarten.png',
      display: true,
      markers: []
    }, {
      name: '小学校',
      icon: 'assets/images/primary-school.png',
      display: true,
      markers: []
    }, {
      name: '中学校',
      icon: 'assets/images/junior-high-school.png',
      display: true,
      markers: []
    }, {
      name: '高校',
      icon: 'assets/images/high-school.png',
      display: true,
      markers: []
    }, {
      name: '公園',
      icon: 'assets/images/park.png',
      display: true,
      markers: []
    }, {
      name: 'ヒヤリハット',
      icon: 'assets/images/incident.png',
      display: true,
      markers: []
    }];

    vm.categories = categories;

    vm.showDetailDialog = function(ev) {
      var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && vm.customFullscreen;
      $mdDialog.show({
        controller: 'DetailDialogController',
        controllerAs: 'detailDialog',
        templateUrl: 'app/components/detailDialog/detailDialog.tmpl.html',
        parent: angular.element($document.body),
        targetEvent: ev,
        clickOutsideToClose: true,
        fullscreen: useFullScreen,
        locals: {
          location: ev.model
        }
      });
    };
  }
})();
