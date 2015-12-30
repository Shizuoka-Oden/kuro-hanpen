(function() {
  'use strict';

  describe('MainController', function(){
    var vm;
    var $mdDialog;

    beforeEach(module('kuro-hanpen'));

    beforeEach(inject(function(_$controller_, _$mdDialog_) {
      vm = _$controller_('MainController');
      $mdDialog = _$mdDialog_;

      spyOn(vm, 'toggleSideMenu');
      spyOn(vm, 'showDetailDialog').and.callThrough();
      spyOn($mdDialog, 'show').and.callThrough();
    }));

    it("tracks that toggleSideMenu() was called", function() {
      vm.toggleSideMenu();
      expect(vm.toggleSideMenu).toHaveBeenCalled();
    });

    it("tracks that showDetailDialog() was called", function() {
      vm.showDetailDialog();
      expect(vm.showDetailDialog).toHaveBeenCalled();
      expect($mdDialog.show).toHaveBeenCalledWith(jasmine.any(Object));
    });

    it('should have a categories object', function() {
      expect(vm.categories).toEqual(jasmine.any(Array));
    });
  });
})();
