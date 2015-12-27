(function() {
  'use strict';

  describe('Sidenav controller', function(){
    var vm;

    beforeEach(module('kuro-hanpen'));

    beforeEach(inject(function(_$controller_) {
      vm = _$controller_('SidenavController');

      spyOn(vm, 'toggleSideMenu');

      vm.toggleSideMenu();
    }));

    it("tracks that toggleSideMenu() was called", function() {
      expect(vm.toggleSideMenu).toHaveBeenCalled();
    });
  });
})();
