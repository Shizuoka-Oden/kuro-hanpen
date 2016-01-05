(function() {
  'use strict';

  describe('GMapController', function(){
    var vm;
    var $scope;

    beforeEach(module('kuro-hanpen'));

    beforeEach(inject(function(_$controller_, $q, _GeoLocation_, $rootScope) {
      // spy response
      var deferred = $q.defer();

      deferred.resolve({
        lat: 34.9714599,
        lon: 138.3869823
      });
      spyOn(_GeoLocation_, 'getCurrent').and.returnValue(deferred.promise);

      deferred = $q.defer();
      deferred.resolve([{
        _id: "1",
        type: "幼稚園",
        address: "住所",
        location: {
          lat: 34.9714599,
          lon: 138.3869823
        },
        title: "タイトル",
        description: "説明文",
        preset:  true
      }]);
      spyOn(_GeoLocation_, 'getMarkers').and.returnValue(deferred.promise);

      var home = $rootScope.$new();
      home.main = {
        categories: [{
          name: '保育園',
          icon: 'assets/images/nursery-school.png',
          display: true,
          markers: []
        }]
      };

      $scope = home.$new();
      vm = _$controller_('GMapController', {
        GeoLocation: _GeoLocation_,
        $scope: $scope
      });
    }));

    it('should have a center object', function() {
      $scope.$apply();
      expect(vm.data.center).toEqual(jasmine.any(Object));
    });

  });
})();
