'use strict';

// Protractor configuration
var config = {
  specs: ['e2etest.js'] 
};

if (process.env.TRAVIS) {
  config.capabilities = {
    browserName: 'chrome'
  };
}
/*
describe('angularjs homepage', function() {
  it('should greet the named user', function() {
    browser.get('http://www.angularjs.org');

    element(by.model('yourName')).sendKeys('Julie');

    var greeting = element(by.binding('yourName'));

    expect(greeting.getText()).toEqual('Hello Julie!');
  });
});
*/ 
exports.config = config;
