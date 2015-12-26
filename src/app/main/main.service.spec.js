(function() {
  'use strict';

  describe('GeoLocation', function(){
    var GeoLocation;
    var $rootScope;

    beforeEach(module('kuro-hanpen'));

    beforeEach(function() {
    });

    function mockGeolocation($window) {
      module(function($provide) {
        $provide.value('$window', $window);
      });
      inject(function($injector) {
        GeoLocation = $injector.get('GeoLocation');
        $rootScope = $injector.get('$rootScope');
      });
    }

    it('should fail when navigator.geolocation is undefined', function(done) {
      var $window = {navigator: {}};
      mockGeolocation($window);

      GeoLocation.getCurrent()
        .then(fail)
        .catch(function(err) {
          expect(err.message).toEqual('Geolocation is not supported');
        })
        .finally(done);

      $rootScope.$apply();
    });

    it('should success when navigator.geolocation is defined', function(done) {
      var getCurrentPosition = function(cb) {
        cb({coords: {
          latitude: 34.9714599,
          longitude: 138.3869823
        }});
      };
      var $window = {navigator: {geolocation: {getCurrentPosition: getCurrentPosition}}};
      mockGeolocation($window);

      GeoLocation.getCurrent()
        .then(function(data){
          expect(data.lat).toEqual(jasmine.any(Number));
          expect(data.lat).toEqual(jasmine.any(Number));
        })
        .catch(fail)
        .finally(done);

      $rootScope.$apply();
    });
  });

})();
