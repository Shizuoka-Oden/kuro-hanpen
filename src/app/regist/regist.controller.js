'use strict';

angular
  .module('kuro-hanpen')
  .value('hiyaloco', {
    type: 'ヒヤリハット',
    address: '',
    location: {},
    title: '交通事故多発',
    description: ''
  })
  .controller('RegistController', RegistController);

/** @ngInject */
function RegistController($mdDialog, GeoLocation, $log, hiyaloco) {
  var vm = this;
  vm.categories = [
    '交通事故多発',
    '急な飛び出し',
    '朝夕通勤・通学',
    'その他'
  ];
  vm.hiyaloco = hiyaloco;

  vm.hiyaloco.address = '';
  vm.hiyaloco.title = '交通事故多発';
  vm.hiyaloco.description = '';

  GeoLocation.getCurrent().then(
    function(location) {
      vm.hiyaloco.location = location;
    },
    function() {
      alert('位置情報を取得できませんでした。');
      // TODO: ダイアログの表示をキャンセルしたい。
      $mdDialog.cancel();
    });

  vm.cancel = function() {
    $mdDialog.cancel();
  };

  vm.regist = function() {
    GeoLocation.regist(vm.hiyaloco)
      .then(function(result) {
        $log.log(result);
        $mdDialog.hide();
      },
      function(reason) {
        $log.error(reason);
      });
  };
}
