(function() {
  'use strict';

  describe('DetailDialog controller', function() {
    var vm;
    var marker, $mdDialog, Like, GeoLocation, Gmap, AwsCognito;
    var createController;

    beforeEach(module('kuro-hanpen'));

    beforeEach(inject(function(_$controller_, _$mdDialog_, _Like_, _GeoLocation_) {
      marker = {
        model: {
          likes: [],
          type: 'ヒヤリハット'
        },
        setMap: jasmine.createSpy('setMap')
      };
      AwsCognito = {
        getUser: jasmine.createSpy('then')
          .and.returnValue({
            then: function(callback) {
              callback('dummy-_-user');
            }
          })
      };
      Gmap = {
        addLikeToCategories: jasmine.createSpy('addLikeToCategories'),
        deleteLocationFromMarkers: jasmine.createSpy('deleteLocationFromMarkers'),
        setRoute: jasmine.createSpy('setRoute'),
        setStreetView: jasmine.createSpy('then')
          .and.returnValue({
            then: function(callback) {
              callback(true);
            }
          })
      };

      $mdDialog = _$mdDialog_;
      spyOn($mdDialog, 'hide').and.callThrough();
      spyOn($mdDialog, 'cancel').and.callThrough();

      Like = _Like_;
      spyOn(Like, 'post');

      GeoLocation = _GeoLocation_;
      spyOn(GeoLocation, 'delete').and.returnValue({
        finally: function(callback) {
          callback();
        }
      });

      createController = function(markerModified) {
        return _$controller_('DetailDialogController', {
          marker: angular.merge({}, marker, markerModified),
          Gmap: Gmap,
          AwsCognito: AwsCognito
        });
      };
    }));

    it('should not equal vm.type and marker.model.type when marker.model.type equal "ヒヤリ"', function() {
      vm = createController();
      expect(vm.type).toEqual('ヒヤリ');
    });

    it('should equal vm.type and marker.model.type when marker.model.type not equal "ヒヤリ"', function() {
      vm = createController({
        model: {
          type: 'hiyari'
        }
      });
      expect(vm.type).toEqual('hiyari');
    });

    it('should define default displayName when not defined marker.model.author', function() {
      vm = createController();
      expect(vm.displayName).toEqual('シズオカオープンデータ');
    });

    it('should define displayName when defined marker.model.author', function() {
      vm = createController({
        model: {
          author: 'dummyuser'
        }
      });
      expect(vm.displayName).toEqual('dummyuser');
    });

    it('should equal userName and displayName when marker.model.author contain delimiter', function() {
      vm = createController({
        model: {
          author: 'dummy-_-user'
        }
      });
      expect(vm.displayName).toEqual('user');
    });

    it('track that AwsCognito.getUser called', function() {
      vm = createController({
        model: {
          likes: ['dummy-_-user']
        }
      });
      expect(AwsCognito.getUser).toHaveBeenCalled();
      expect(vm.user).toEqual('dummy-_-user');
      expect(vm.likedata.liked).toBeTruthy();
    });

    it('track that AwsCognito.getUser called', function() {
      vm = createController();
      expect(AwsCognito.getUser).toHaveBeenCalled();
      expect(vm.user).toEqual('dummy-_-user');
      expect(vm.likedata.liked).not.toBeTruthy();
    });

    it('track that Gmap.setStreetView called', function() {
      vm = createController();
      expect(Gmap.setStreetView).toHaveBeenCalled();
      expect(vm.panoramaHide).toBeFalsy();
    });

    it('track that hide called', function() {
      vm = createController();
      vm.hide();
      expect($mdDialog.hide).toHaveBeenCalled();
    });

    it('track that route called', function() {
      vm = createController();
      vm.route();
      expect($mdDialog.hide).toHaveBeenCalled();
    });

    it('track that cancel called', function() {
      vm = createController();
      vm.cancel();
      expect($mdDialog.cancel).toHaveBeenCalled();
    });

    it('should be truthy isConfirm when deleteConfirm called', function() {
      vm = createController();
      vm.deleteConfirm();
      expect(vm.isConfirm).toBeTruthy();
    });

    it('should be updated likedata when like called', function() {
      vm = createController();
      var count = vm.likedata.count;
      vm.like();
      expect(vm.likedata.liked).toBeTruthy();
      expect(vm.likedata.count).toEqual(count + 1);
      expect(Gmap.addLikeToCategories).toHaveBeenCalled();
    });

    it('tracks that delete was called', function() {
      vm = createController();
      vm.delete();
      expect(Gmap.deleteLocationFromMarkers).toHaveBeenCalled();
      expect(GeoLocation.delete).toHaveBeenCalled();
      expect(marker.setMap).toHaveBeenCalled();
      expect($mdDialog.hide).toHaveBeenCalled();
    });
  });
})();
