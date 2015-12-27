(function() {
  'use strict';

  angular
    .module('kuro-hanpen')
    .factory('GeoLocation', GeoLocation);

  /** @ngInject */
  function GeoLocation($q, $window, $http, apiServer) {
    return {
      getCurrent: function(){
        var deferred = $q.defer();
        if(!$window.navigator.geolocation) {
          deferred.reject(new Error('Geolocation is not supported'));
        } else {
          $window.navigator.geolocation.getCurrentPosition(function(position) {
            deferred.resolve({
              lat: position.coords.latitude,
              lon: position.coords.longitude
            });
          }, deferred.reject);
        }

        return deferred.promise;
      },

      getMarkers: function(type) {
        var deferred = $q.defer();

        $http.get(apiServer + '/production/location?type=' + type)
          .then(function(response) {
            if(response.status != 200) {
              deferred.reject(new Error('Failed to load markers.'));
            }
            deferred.resolve(response.data.results);
          });

        return deferred.promise;
      }
    };
  }
})();
