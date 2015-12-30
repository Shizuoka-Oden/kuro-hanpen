(function() {
  'use strict';

  angular
    .module('kuro-hanpen')
    .factory('Gmap', Gmap);

  /** @ngInject */
  function Gmap($document, $q, uiGmapGoogleMapApi, GmapData, Categories) {
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

      // 指定したドキュメントIDのエレメントにストリートビューを埋め込む
      setStreetView: function(latLng, documentId) {
        return $q(function(resolve) {
          uiGmapGoogleMapApi.then(function(maps) {
            var sv = new maps.StreetViewService();
            sv.getPanorama({
              location: latLng,
              radius: 50
            }, processSVData);

            function processSVData(data, status) {
              var panorama = new maps.StreetViewPanorama($document[0].getElementById(documentId), {
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
      }
    };
  }
})();
