(function() {
  'use strict';

  angular
    .module('kuro-hanpen')
    .factory('GeoLocation', GeoLocation);

  /** @ngInject */
  function GeoLocation($q, $window) {
    return {
      getCurrent: function(){
        var deferred = $q.defer();
        if(!$window.navigator) {
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
      }
    };
  }
})();
