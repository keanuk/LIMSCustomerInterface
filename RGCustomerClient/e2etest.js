/* 
describe('by model', function() {
   it('should find an element by text input model', function() {
     var username = element(by.model('username'));
     var name = element(by.binding('username'));

     username.clear();
     expect(name.getText()).toEqual('');

     username.sendKeys('Jane Doe');
     expect(name.getText()).toEqual('Jane Doe');
   });
});
*/ 

describe('angularjs homepage', function() {
  it('should greet the named user', function() {
    browser.get('http://www.angularjs.org');

    element(by.model('yourName')).sendKeys('Julie');

    var greeting = element(by.binding('yourName'));

    expect(greeting.getText()).toEqual('Hello Julie!');
  });
});
