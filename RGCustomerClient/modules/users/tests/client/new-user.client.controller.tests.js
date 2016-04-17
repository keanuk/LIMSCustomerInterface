'use strict';

(function () {
  // Authentication controller Spec
  describe('AuthenticationController', function () {
    // Initialize global variables
    var AuthenticationController,
      scope,
      $http,
      $filter,
      $state;

    beforeEach(function () {
      jasmine.addMatchers({
        toEqualData: function (util, customEqualityTesters) {
          return {
            compare: function (actual, expected) {
              return {
                pass: angular.equals(actual, expected)
              };
            }
          };
        }
      });
    });

    // Load the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    describe('New User added', function () {
      // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
      // This allows us to inject a service but then attach it to a variable
      // with the same name as the service.
      beforeEach(inject(function ($controller, $scope, $filter, $http, $state) {
        // Set a new global scope
        // scope = $rootScope.$new();

        // Point global variables to injected services
        // $filter = _$filter_;
        // $http = _$http_;
        // $state = _$state_;

        // Initialize the Authentication controller
        AuthenticationController = $controller('AuthenticationController', {
          $scope: scope
        });
      }));

      describe('$scope.submitNewUser()', function () {
        it('should set submitted to true', function () {
          scope.submitNewUser();
          expect(scope.submitted).toBeTruthy();
        });

        it('should set email mistmach to true if emails do not match', function () {
          expect(scope.newUser).toBeDefined();

          if(scope.newUser.email !== scope.newUser.email2){
            expect(scope.emailMistmatch).toBeTruthy();
          }
        });
      });
    });
  });
}());
