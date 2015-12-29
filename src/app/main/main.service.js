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
            deferred.resolve(response.data.results);
          },function() {
            deferred.reject(new Error('Failed to load markers.'));
          });

        return deferred.promise;
      },

      delete: function(id) {
        var deferred = $q.defer();

        $http.delete(apiServer + '/production/location/' + id)
          .then(function(response) {
            deferred.resolve(response);
          },function() {
            deferred.reject(new Error('Failed to delete location.'));
          });

        return deferred.promise;
      }
    };
  }
})();
