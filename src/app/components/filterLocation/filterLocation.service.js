(function() {
  'use strict';

  angular
    .module('kuro-hanpen')
    .service('FilterLocation', FilterLocation);

  /** @ngInject */
  function FilterLocation() {
    var filters = [{
      name: '保育園',
      img: 'nursery-school.png',
      checked: true
    }, {
      name: '幼稚園',
      img: 'kindergarten.png',
      checked: true
    }, {
      name: '小学校',
      img: 'primary-school.png',
      checked: true
    }, {
      name: '中学校',
      img: 'junior-high-school.png',
      checked: true
    }, {
      name: '高校',
      img: 'high-school.png',
      checked: true
    }, {
      name: '公園',
      img: 'park.png',
      checked: true
    }, {
      name: 'ヒヤリハット',
      img: 'incident.png',
      checked: true
    }];

    this.getFilters = getFilters;

    function getFilters() {
      return filters;
    }
  }

})();
