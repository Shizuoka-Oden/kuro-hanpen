'use strict';

describe('The main view', function () {
  var page;

  beforeEach(function () {
    browser.get('/index.html');
    page = require('./main.po');
  });

  it('should include map', function() {
    expect(page.uiGmap).toBeDefined();
  });
});
