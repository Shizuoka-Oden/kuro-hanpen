(function() {
  'use strict';

  describe('controllers', function(){
    var vm;

    beforeEach(module('kuro-hanpen'));

    beforeEach(inject(function(_$controller_, $q, _GeoLocation_) {
      // spy response
      var deferred = $q.defer();
      deferred.resolve({
        lat: 34.9714599,
        lon: 138.3869823
      });
      spyOn(_GeoLocation_, 'getCurrent').and.returnValue(deferred.promise);

      vm = _$controller_('MainController', {
        GeoLocation: _GeoLocation_
      });
    }));

    it('should have a map object', function() {
      expect(vm.map).toEqual(jasmine.any(Object));
    });

    it('should have map options', function() {
      expect(vm.options).toEqual(jasmine.any(Object));
    });
  });
})();
