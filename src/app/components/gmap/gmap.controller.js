(function() {
  'use strict';

  angular
    .module('kuro-hanpen')
    .controller('GMapController', GMapController);

  /** @ngInject */
  function GMapController(GeoLocation, Categories, GmapData) {
    var vm = this;
    vm.data = GmapData;
    GeoLocation.getCurrent().then(function(location) {
      vm.data.center = {
        latitude: location.lat,
        longitude: location.lon
      };
      vm.data.current = {
        latitude: location.lat,
        longitude: location.lon
      };
    }, function() {
      vm.data.center = {
        latitude: 34.9714699,
        longitude: 138.3869833
      };
      vm.data.current = {
        latitude: 34.9714699,
        longitude: 138.3869833
      };
    });

    Categories.forEach(function(category) {
      GeoLocation.getMarkers(category.name)
        .then(function(markers) {
          category.markers = convertMarkersResponse(markers, category);
      });
    });
  }

  function convertMarkersResponse(markers, category) {
    return markers.map(function(marker) {
      return {
        id: marker._id,
        icon: category.icon,
        latitude: marker.location.lat,
        longitude: marker.location.lon,
        type: marker.type,
        address: marker.address,
        title: marker.title,
        description: marker.description,
        likes: marker.likes,
        preset: marker.preset
      };
    });
  }
})();
