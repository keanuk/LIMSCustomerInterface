'use strict';

(function () {
  // Authentication controller Spec
  describe('AuthenticationController', function () {
    // Initialize global variables
    var AuthenticationController,
        scope,
        $filter;

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

    describe('List of users', function () {
      // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
      // This allows us to inject a service but then attach it to a variable
      // with the same name as the service.
      beforeEach(inject(function ($controller, $rootScope, _$filter_) {
        // Set a new global scope
        scope = $rootScope.$new();

        // Point global variables to injected services
        $filter = _$filter_;

        // Initialize the Authentication controller
        AuthenticationController = $controller('AuthenticationController', {
          $scope: scope
        });
      }));

      describe('$scope.buildPager()', function () {
        it('should set items per page to 15', function () {

          scope.buildPager();

          // Test scope value
          expect(scope.itemsPerPage).toEqual(15);
        });

        it('should initialize current page to 1', function () {

          scope.buildPager();
          // Test scope value
          expect(scope.currentPage).toEqual(1);
        });
      });

      describe('$scope.figureOutItemsToDisplay()', function () {
        it('should have a valid filter filteredLength', function () {

          expect(scope.filteredLength).toBeDefined();
        });
      });
    });
  });
}());
