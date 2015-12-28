(function() {
  'use strict';

  angular
    .module('kuro-hanpen')
    .controller('MainController', MainController);

  /** @ngInject */
  function MainController($mdSidenav) {
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
  }
})();
