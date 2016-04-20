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

describe('login page', function() {
  it('should redirect on login click', function() {
	browser.ignoreSynchronization = true; 
    browser.get('http://localhost:3000');
//	setTimeout(function(){}, 6000);
//	browser.actions().mouseMove(element(by.id('rg-login'))).perform();
	var butt = element(by.buttonText('Log In')); 
	butt.click();
	// you can do by button text by.buttonText('button says what'); 
//    element(by.id('rg-login')).sendKeys('');
//	var elementToClick = $('#gotest');
//	browser.wait(protractor.ExpectedConditions.elementToBeClickable(elementToClick), 10000)
//	.then ( function () {
//		elementToClick.click();
//	});yourName));

	expect(browser.getCurrentUrl()).toMatch('localhost:3000/signin');
  });
});
