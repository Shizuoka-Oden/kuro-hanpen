(function() {
  'use strict';

  angular
    .module('kuro-hanpen')
    .factory('Like', Like);

  /** @ngInject */
  function Like($http, apiServer) {
    return {
      post: function(id, user){
        return $http.post(apiServer + '/production/location/' + id + '/like', angular.toJson({user: user}));
      }
    };
  }
})();
