(function() {
  'use strict';

  angular
    .module('kuro-hanpen')
    .factory('Gmap', Gmap);

  /** @ngInject */
  function Gmap($q, uiGmapGoogleMapApi, GmapData, Categories, $log) {
    return {
      // ヒヤリハットカテゴリのマーカーから対象データを削除
      deleteLocationFromMarkers: function(id){
        var markers = Categories[Categories.length-1].markers;
        for (var i = 0; i <= markers.length; i++) {
          if (markers[i].id === id) {
            markers.splice( i , 1 );
            break;
          }
        }
      },

      // ヒヤリハットカテゴリにマーカーを追加
      addLocationToMarkers: function(marker) {
        Categories[Categories.length-1].markers.push(marker);
      },

      // セレクタで指定した要素にストリートビューを埋め込む
      setStreetView: function(latLng, selector) {
        return $q(function(resolve, reject) {
          uiGmapGoogleMapApi.then(function(maps) {
            var sv = new maps.StreetViewService();
            sv.getPanorama({
              location: latLng,
              radius: 50
            }, processSVData);

            function processSVData(data, status) {
              var element = angular.element(selector);
              if (!angular.isElement(element[0])) {
                reject(new Error('Element is not found'));
              }
              var panorama = new maps.StreetViewPanorama(element[0], {
                addressControl: false,
                zoomControl: false,
                panControl: false
              });
              var show = status === maps.StreetViewStatus.OK;
              if (show) {
                panorama.setPano(data.location.pano);
                panorama.setPov({
                  heading: 270,
                  pitch: 0
                });
              }
              panorama.setVisible(show);
              resolve(show);
            }
          });
        });
      },

      // ルート表示をする
      setRoute: function(latLng) {
        uiGmapGoogleMapApi.then(function(maps) {
          if (!GmapData.directionsDisplay) {
            GmapData.directionsDisplay = new maps.DirectionsRenderer();
          }
          GmapData.directionsDisplay.setMap(GmapData.control.getGMap());

          var directionsService = new maps.DirectionsService();
          var start = GmapData.current.latitude.toString() + "," + GmapData.current.longitude.toString();
          var request = {
            origin: start,
            destination: latLng,
            travelMode: maps.TravelMode.WALKING
          };
          directionsService.route(request, function(response, status) {
            if (status == maps.DirectionsStatus.OK) {
              GmapData.directionsDisplay.setDirections(response);
            }
          });
        });
      },

      addLatLng : function (map, eventName, originalEventArgs) {
        uiGmapGoogleMapApi.then(function(maps) {
          var e = originalEventArgs[0];
          var geocoder;
          geocoder = new maps.Geocoder();
          var lat = parseFloat(e.latLng.lat());
          var lng = parseFloat(e.latLng.lng());
          var latlng = new maps.LatLng(lat, lng);

          geocoder.geocode({'latLng': latlng}, function(results, status) {
            if (status == maps.GeocoderStatus.OK) {
              if (results[0]) {
                $log.info(lat);
                $log.info(lng);
                $log.info(results[0].formatted_address);
              } else {
                alert('No results found');
              }
            } else {
              alert('Geocoder failed due to: ' + status);
            }
          });
        });
      }

    };
  }
})();
