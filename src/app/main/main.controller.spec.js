(function() {
  'use strict';

  describe('MainController', function(){
    var vm;

    beforeEach(module('kuro-hanpen'));

    beforeEach(inject(function(_$controller_) {
      vm = _$controller_('MainController');

      spyOn(vm, 'toggleSideMenu');

      vm.toggleSideMenu();
    }));

    it("tracks that toggleSideMenu() was called", function() {
      expect(vm.toggleSideMenu).toHaveBeenCalled();
    });

    it('should have a categories object', function() {
      expect(vm.categories).toEqual(jasmine.any(Array));
    });
  });
})();
