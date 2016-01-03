(function() {
  'use strict';

  angular
    .module('kuro-hanpen')
    .controller('UserDialogController', UserDialogController);

  /** @ngInject */
  function UserDialogController($mdDialog, AwsCognito, $log) {
    var vm = this;

    AwsCognito.getUserId()
    .then(function (userid) {
      vm.userid = userid;
    });

    AwsCognito.getUserName()
    .then(function (userName) {
      vm.userName = userName;
      if (userName) {
        vm.disable = true;
      }
    });

    vm.hide = function() {
      $mdDialog.hide();
    };

    vm.cancel = function() {
      $mdDialog.cancel();
    };

    vm.save = function() {
      AwsCognito.setUserName(vm.userName)
      .then(function(){
        vm.hide();
      },function(err) {
        $log.info(err);
      }
      );
    };
  }
})();
