(function() {
  'use strict';

  angular
      .module('kuro-hanpen')
      .service('FilterLocation', FilterLocation);

  /** @ngInject */
  function FilterLocation() {
    var filter = [{
      name: '保育園',
      img: 'nursery-school.png'
    }, {
      name: '幼稚園',
      img: 'kindergarten.png'
    }, {
      name: '小学校',
      img: 'primary-school.png'
    }, {
      name: '中学校',
      img: 'junior-high-school.png'
    }, {
      name: '高校',
      img: 'high-school.png'
    }, {
      name: '公園',
      img: 'park.png'
    }, {
      name: 'ヒヤリハット',
      img: 'incident.png'
    }];

    this.getFilters = getFilters;

    function getFilters() {
      return filter;
    }
  }

})();
