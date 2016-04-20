'use strict';

(function () {
  // Authentication controller Spec
  describe('AuthenticationController', function () {
    // Initialize global variables
    var AuthenticationController,
      scope,
      $http,
      $state,
      $location;

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

    describe('user client controller', function () {
      // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
      // This allows us to inject a service but then attach it to a variable
      // with the same name as the service.
      beforeEach(inject(function ($controller, $rootScope, _$state_, _$http_) {
        // Set a new global scope
        scope = $rootScope.$new();

        // Point global variables to injected services
        $state = _$state_;
        $http = _$http_;


        // Initialize the Authentication controller
        AuthenticationController = $controller('AuthenticationController', {
          $scope: scope
        });
      }));

      describe('$scope.loadProjects()', function () {
        it('should define http', function () {
          // Test expected GET request
          expect(scope.http).toBeDefined();
          $http.when('GET', '/api/userprojects?userId='+scope.authentication).respond(200);

          scope.loadProjects(true);
          $http.flush();
        });

        describe('scope.successCallback()', function(){
          it('should define nonSelected data', function(){
            expect(scope.nonSelected).toBeDefined();
          });
        });
      });
    });
  });
}());
