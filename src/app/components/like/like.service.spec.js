(function() {
  'use strict';

  describe('Like', function() {
    var Like;
    var $http;

    beforeEach(module('kuro-hanpen'));

    beforeEach(inject(function(_$q_, _$rootScope_, _$http_, _Like_) {
      Like = _Like_;
      $http = _$http_;
    }));

    it("tracks that $http.post() was called", function() {
      spyOn($http, 'post');

      Like.post('dummyId', 'dummmyUser');

      expect($http.post)
        .toHaveBeenCalledWith(
          'https://m4fgyamv41.execute-api.ap-northeast-1.amazonaws.com/production/location/dummyId/like',
          '{"user":"dummmyUser"}'
        );
    });
  });
})();
