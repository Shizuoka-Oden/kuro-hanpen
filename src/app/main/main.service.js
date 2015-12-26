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

      // getMarkers: function(type){
      getMarkers: function(){
        var deferred = $q.defer();

        // ホントはサーバに問い合わせて type でフィルタしてもらう
        deferred.resolve([{
          _id: "1",
          type: "幼稚園",
          address: "住所",
          location: {
            lat: 34.9714699,
            lon: 138.3869833
          },
          title: "詳細情報画面に表示するタイトル",
          description: "詳細情報画面に表示する説明文",
          preset: true
        }, {
          _id: "2",
          type: "保育園",
          address: "住所",
          location: {
            lat: 34.960325,
            lon: 138.404338
          },
          title: "詳細情報画面に表示するタイトル",
          description: "詳細情報画面に表示する説明文",
          preset: true
        }, {
          _id: "3",
          type: "小学校",
          address: "住所",
          location: {
            lat: 34.9714699,
            lon: 138.3969833
          },
          title: "詳細情報画面に表示するタイトル",
          description: "詳細情報画面に表示する説明文",
          preset: true
        }, {
          _id: "4",
          type: "中学校",
          address: "住所",
          location: {
            lat: 34.9514699,
            lon: 138.4069833
          },
          title: "詳細情報画面に表示するタイトル",
          description: "詳細情報画面に表示する説明文",
          preset: true
        }, {
          _id: "5",
          type: "高校",
          address: "住所",
          location: {
            lat: 34.9514699,
            lon: 138.3769833
          },
          title: "詳細情報画面に表示するタイトル",
          description: "詳細情報画面に表示する説明文",
          preset: true
        }, {
          _id: "6",
          type: "公園",
          address: "住所",
          location: {
            lat: 34.9714699,
            lon: 138.3669833
          },
          title: "詳細情報画面に表示するタイトル",
          description: "詳細情報画面に表示する説明文",
          preset: true
        }, {
          _id: "7",
          type: "ヒヤリハット",
          address: "住所",
          location: {
            lat: 34.9714699,
            lon: 138.4069833
          },
          title: "詳細情報画面に表示するタイトル",
          description: "詳細情報画面に表示する説明文",
          preset: true
        }]);
        return deferred.promise;
      }
    };
  }

})();
