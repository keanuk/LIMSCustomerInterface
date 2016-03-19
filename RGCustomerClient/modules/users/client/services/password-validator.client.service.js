'use strict';

// PasswordValidator service used for testing the password strength
angular.module('users').factory('PasswordValidator', ['$window',
  function ($window) {
    var owaspPasswordStrengthTest = $window.owaspPasswordStrengthTest;
    owaspPasswordStrengthTest.config({
        minLength: 12,
        minOptionalTestsToPass: 3
    });

    return {
      getResult: function (password) {
        var result = owaspPasswordStrengthTest.test(password);
        return result;
      },
      getPopoverMsg: function () {
        var popoverMsg = 'Please enter a passphrase with at least 12 characters and two of the following:\n Numbers, lowercase, upppercase, or special characters.';
        return popoverMsg;
      }
    };
  }
]);
