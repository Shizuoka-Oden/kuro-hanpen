(function() {
  'use strict';

  describe('Gmap', function() {
    var Gmap;
    var $q, $rootScope;

    beforeEach(module('kuro-hanpen'));

    beforeEach(inject(function(_$q_, _$rootScope_, _Gmap_) {
      Gmap = _Gmap_;
      $q = _$q_;
      $rootScope = _$rootScope_;
    }));

    it("tracks that deleteLocationFromMarkers was called", function() {
      spyOn(Gmap, 'deleteLocationFromMarkers');

      Gmap.deleteLocationFromMarkers('dummy');

      expect(Gmap.deleteLocationFromMarkers).toHaveBeenCalledWith(jasmine.any(String));
    });

    it("tracks that setStreetView was called and return boolean", function() {
      var deferred = $q.defer();
      var returnValue;

      spyOn(Gmap, 'setStreetView').and.returnValue(deferred.promise);

      deferred.resolve(true);

      Gmap.setStreetView({
        lat: 34.9714699,
        lng: 138.3869833
      }, '#pano').then(function(value) {
        returnValue = value;
      });

      $rootScope.$apply();
      expect(returnValue).toEqual(jasmine.any(Boolean));
    });

    it("tracks that setRoute was called", function() {
      spyOn(Gmap, 'setRoute');

      Gmap.setRoute({
        lat: 34.9714699,
        lng: 138.3869833
      }, '#pano');

      expect(Gmap.setRoute).toHaveBeenCalledWith({
        lat: 34.9714699,
        lng: 138.3869833
      }, '#pano');
    });
  });
})();
