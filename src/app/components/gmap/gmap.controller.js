(function() {
  'use strict';

  angular
    .module('kuro-hanpen')
    .controller('GMapController', GMapController);

  /** @ngInject */
  function GMapController(GeoLocation, Categories, GmapData, Gmap) {
    var vm = this;
    vm.data = GmapData;
    GeoLocation.getCurrent().then(function(location) {
      var current = {
        latitude: location.lat,
        longitude: location.lon
      };
      vm.data.center = angular.copy(current);
      vm.data.current = angular.copy(current);
    }, function() {
      var current = {
        latitude: 34.9714699,
        longitude: 138.3869833
      };
      vm.data.center = angular.copy(current);
      vm.data.current = angular.copy(current);
    });

    Categories.forEach(function(category) {
      GeoLocation.getMarkers(category.name)
        .then(function(markers) {
          category.markers = convertMarkersResponse(markers, category);
      });
    });

    vm.data.events = {
      click: function (map, eventName, originalEventArgs) {
        Gmap.addLatLng(map, eventName, originalEventArgs);
      }
    }
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
        author: marker.author,
        preset: marker.preset
      };
    });
  }
})();
