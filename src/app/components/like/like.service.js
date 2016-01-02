(function() {
  'use strict';

  angular
    .module('kuro-hanpen')
    .factory('Like', Like);

  /** @ngInject */
  function Like($q, $http, apiServer) {
    return {
      post: function(id, user){
        return $q(function(resolve, reject) {
          $http.post(apiServer + '/production/location/' + id + '/like', angular.toJson({user: user}))
          .then(function() {
            resolve();
          },function() {
            reject(new Error('Failed to load markers.'));
          });
        });
      }
    };
  }
})();
