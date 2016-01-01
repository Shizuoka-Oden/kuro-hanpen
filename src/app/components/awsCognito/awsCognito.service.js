(function() {
  'use strict';

  angular
    .module('kuro-hanpen')
    .factory('AwsCognito', AwsCognito);

  /** @ngInject */
  function AwsCognito($q, awsRegion, identityPoolKurohanpenId) {
    /*global AWS*/
    AWS.config.region = awsRegion;
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: identityPoolKurohanpenId
    });

    function setMyDataset(key, value){
      return $q(function(resolve, reject) {
        AWS.config.credentials.get(function() {
          var syncClient = new AWS.CognitoSyncManager();
          syncClient.openOrCreateDataset('myDataset', function(err, dataset) {
            dataset.put(key, value, function(){
              dataset.synchronize({
                onSuccess: function(data) {
                  resolve(data);
                },
                onFailure: function(err) {
                  reject(err);
                },
                onConflict: function(dataset, conflicts, callback) {
                  var resolved = [];
                  for (var i=0; i<conflicts.length; i++) {
                    // Take local version.
                    resolved.push(conflicts[i].resolveWithLocalRecord());
                  }
                  dataset.resolve(resolved, function() {
                    return callback(true);
                  });
                }
              });
            });
          });
        });
      });
    }

    function getMyDataset(key){
      return $q(function(resolve, reject) {
        AWS.config.credentials.get(function() {
          var syncClient = new AWS.CognitoSyncManager();
          syncClient.openOrCreateDataset('myDataset', function(err, dataset) {
            dataset.get(key, function(err, value) {
              if (err) {
                reject(err);
              }
              resolve(value);
            });
          });
        });
      });
    }

    return {
      getUserId: function(){
        return $q(function(resolve, reject) {
          AWS.config.credentials.get(function() {
            resolve(AWS.config.credentials.identityId);
          },function() {
            reject(new Error('Failed to load userId.'));
          });
        });
      },

      setUserName: function(userName) {
        return setMyDataset('userName', userName);
      },

      getUserName: function() {
        return getMyDataset('userName');
      }
    };
  }
})();
