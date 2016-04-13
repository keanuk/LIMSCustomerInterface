'use strict';

angular.module('core').config(['$sceProvider',function($sceProvider){
    $sceProvider.enabled(false);
}]).directive('plateView', ['$uibModal', 'lodash', '$location', '$uibPosition', '$uibTooltip', '$timeout', '$http', '$sce',
  function($uibModal, _, $location, $uibPosition, $uibTooltip, $timeout, $http, $sce) {

    function getLetter(sampleCode) {
      return sampleCode.substring(sampleCode.length - 3, sampleCode.length - 2);
    }

    function getNumber(sampleCode) {
      return parseFloat(sampleCode.substring(sampleCode.length - 2, sampleCode.length));
    }

    function sampleInArray(sample, arr) {
      var ids = _.map(arr, '_id');
      if (!sample) return false;
      return _.includes(ids, sample._id);
    }

    function removeSampleFromArray(sample, arr) {
      var ids = _.map(arr, '_id');
      var index = ids.indexOf(sample._id);
      if (index >= 0) {
        arr.splice(index, 1);
      }
    }

    function linkingFunction(scope, element, attrs, shouldSignalModalClosed) {
      scope._ = _;

      scope.selectedSamples = [];
      scope.selectionVariables = {
        letterOne: null,
        letterTwo: null,
        numberOne: null,
        numberTwo: null
      };

      scope.tempSelectedSamples = [];

      var selectTemporarily = function(sample) {

        if (sampleInArray(sample, scope.tempSelectedSamples)) {
          return;
        }

        var letter = getLetter(sample.sampleCode);
        var number = getNumber(sample.sampleCode);

        scope.selectionVariables.letterOne = letter;
        scope.selectionVariables.letterTwo = letter;
        scope.selectionVariables.numberOne = number;
        scope.selectionVariables.numberTwo = number;

        scope.tempSelectedSamples.push(sample);
      };

      var selectMultiple = function($event, sample) {
        if ($event.buttons !== 1) return;

        var letter = getLetter(sample.sampleCode);
        var number = getNumber(sample.sampleCode);

        scope.selectionVariables.numberTwo = number;
        scope.selectionVariables.letterTwo = letter;

        var colIndexOne = scope.colLetter.indexOf(scope.selectionVariables.letterOne);
        var colIndexTwo = scope.colLetter.indexOf(scope.selectionVariables.letterTwo);

        var startColIndex = Math.min(colIndexOne, colIndexTwo);
        var endColIndex = Math.max(colIndexOne, colIndexTwo);

        var numberIndexOne = scope.rowNumber.indexOf(('00' + scope.selectionVariables.numberOne).slice(-2));
        var numberIndexTwo = scope.rowNumber.indexOf(('00' + scope.selectionVariables.numberTwo).slice(-2));

        var startNumberIndex = Math.min(numberIndexOne, numberIndexTwo);
        var endNumberIndex = Math.max(numberIndexOne, numberIndexTwo);

        var colRange = _.range(startColIndex, endColIndex + 1);
        var rowRange = _.range(startNumberIndex, endNumberIndex + 1);

        _.forEach(colRange, function(i) {
          var curColLetter = scope.colLetter[i];
          _.forEach(rowRange, function(j) {
            var curRowNumber = scope.rowNumber[j];
            var tempSample = scope.samplesDict['W' + curColLetter + curRowNumber];

            if (!tempSample) {
              return;
            }

            if (sampleInArray(tempSample, scope.tempSelectedSamples)) {
              return;
            }

            scope.tempSelectedSamples.push(tempSample);
          });
        });

        scope.tempSelectedSamples = _.filter(scope.tempSelectedSamples, function(tempSample) {
          var tempSampleNumber = getNumber(tempSample.sampleCode);
          var tempSampleLetter = getLetter(tempSample.sampleCode);

          var tempSampleLetterOrderIndex = scope.colLetter.indexOf(tempSampleLetter);
          var tempSampleNumberOrderIndex = scope.rowNumber.indexOf(('00' + tempSampleNumber).slice(-2));

          return _.includes(colRange, tempSampleLetterOrderIndex) && _.includes(rowRange, tempSampleNumberOrderIndex);
        });

      };

      var selectPermanantly = function(sample) {
        if (sampleInArray(sample, scope.selectedSamples) && scope.tempSelectedSamples.length === 1) {
          removeSampleFromArray(sample, scope.tempSelectedSamples);
          removeSampleFromArray(sample, scope.selectedSamples);
          return;
        }
        _.forEach(scope.tempSelectedSamples, function(tempSelectedSample) {
          if (sampleInArray(tempSelectedSample, scope.selectedSamples)) {
            return;
          }
          scope.selectedSamples.push(tempSelectedSample);
        });
        scope.tempSelectedSamples.length = 0;
      };

			$sce.trustAsResourceUrl('modules/core/client/directives/directivesHTML/plate-view-sample-modal-view.html');
      var openSampleModal = function(sample) {
        scope.tempSample = scope.makeSampleFieldsPretty(sample);
        scope.tempAttrNames = _.keys(scope.tempSample);

        scope.wellId = sample.sampleCode.substring(sample.sampleCode.length - 4, sample.sampleCode.length);
        sampleModal = $uibModal.open({
          animation: true,
          scope: scope,
          size: 'lg',
					templateUrl: 'modules/core/client/directives/directivesHTML/plate-view-sample-modal-view.html'
        });
      };

      scope.openPlateModal = function() {
        var modal = $uibModal.open({
          animation: true,
          scope: scope,
          size: 'lg',
					templateUrl: 'modules/core/client/directives/directivesHTML/plate-view-modal-view.html'
        });

        modal.result.then(function() {
          console.log('Modal opened.'); //Since this is a promise follow up, this should never get printed
        }, function() {
          if (shouldSignalModalClosed) {
            scope.$emit('modalClosed');
          }
        });
      };

      scope.modes = [{
        name: 'ViewSamples',
        description: 'Click a Well for Details',
        onSampleClick: openSampleModal
      }, {
        name: 'SelectSamples',
        description: 'Click or Drag to Select',
        onSampleClick: selectTemporarily,
        onSampleRelease: selectPermanantly,
        onSampleDrag: selectMultiple
      }];

      scope.selected = {
        mode: _.first(scope.modes),
        modeIndex: 0
      };

      // Used modeIndex, as we couldn't get the function onSampleClick to be in the HTML
      scope.$watch('selected.modeIndex', function(index) {
        scope.selected.mode = scope.modes[index];
      });

      scope.samplesDict = _.mapValues(_.groupBy(scope.samplesArray, function(sample) {
        var sampleCode = sample.sampleCode;
        var well = sampleCode.substring(sampleCode.length - 4, sampleCode.length);
        return well;
      }), function(sampleArr) {
        return sampleArr.pop();
      });

      var sampleModal;

      scope.colLetter = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
      scope.rowNumber = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];


      scope.makeSampleFieldsPretty = function(sample) {
        var prettyFieldsJSON = {
          'RG Sample Code': 'sampleCode',
          'Unique Client Code': 'uniqueClientCode',
          'Customer Concentration (ng / uL) <p> <small><em>(don\'t trust!)</em></small>': 'customerConcentration',
          'Customer Volume (uL)': 'volume',
          'Initial RG Total DNA': 'totalDNA',
          'Current Amount of DNA In Lab (ng)': 'currentTotalDNAInLab',
          'Current GDNA Concentration (ng / uL) <p> <small><em>(equal to last element in gDNA Concentrations Array)</small></em>': 'currentGDNAConcentration',
          'Volume Present In Lab (uL)': 'volumeInLab',
          'gDNA Concentrations': 'gDNAQuantificationInfo',
          'Normalizations': 'normalizations',
          'Total Library DNA (ng)': 'totalLibraryDNA',
          'Current Library DNA Concentration (ng / uL)': 'currentLibraryDNAConcentration',
          'Library Quantifications': 'libraryDNAQuantificationInfo',
          'Pre-Capture PCR Reactions': 'pcrEnrichmentInfo',
          'Comment': 'comment',
          'Row Sort': 'plateLayoutRowSort',
          'Column Sort': 'plateLayoutColumnSort'
        };

        if (scope.samplePrettyFields) {
          prettyFieldsJSON = _.extend(prettyFieldsJSON, scope.samplePrettyFields);
        }

        var prettySample = {};
        var newFieldsArray = _.keys(prettyFieldsJSON);

        for (var index in newFieldsArray) {
          var prettyFieldName = newFieldsArray[index];
          var uglyFieldName = prettyFieldsJSON[prettyFieldName];
          if (sample && sample[uglyFieldName]) {
            prettySample[prettyFieldName] = angular.toJson(sample[uglyFieldName], true);
          }
        }

        return prettySample;
      };

      scope.setSelectedQuickViewSetting = function(setting) {
        scope.selectedQuickViewSetting = setting;
      };

      scope.isSelectedSetting = function(setting) {
        try {
          return setting.name === scope.selectedQuickViewSetting.name;
        } catch (ex) {
          return false;
        }
      };

      scope.getOpacity = function(sample) {
        if (!sample) return 1.0;
        if (scope.selected.mode.name !== 'SelectSamples') return 1.0;

        if (sampleInArray(sample, scope.tempSelectedSamples) || sampleInArray(sample, scope.selectedSamples)) {
          return 1.0;
        } else {
          return 0.4;
        }
      };

      scope.getBackgroundColor = function(sample) {
        if (!sample) return 'lightgrey';

        var color;

        _.forEach(scope.colorFunctions, function(colorFunction) {
          var tempColor = colorFunction(sample);
          if (tempColor) {
            color = tempColor;
          }
        });

        return color || 'white';
      };

      scope.displayData = function(sample) {
        try {
          return scope.selectedQuickViewSetting.displayDataFunction(sample) || 'N/A';
        } catch (ex) {
          return 'N/A';
        }
      };

      scope.clearSelection = function() {
        scope.selectedSamples.length = 0;
        scope.tempSelectedSamples.length = 0;
      };
    }

    return {
      restrict: 'E',
      template: '<button data-ng-click="openPlateModal()" class="btn btn-xs btn-danger">View</button>',
      scope: {
        colorFunctions: '=',
        quickViewSettings: '=',
        samplesArray: '=',
        plateCode: '=',
        subtitle: '=?',
        selectedQuickViewSetting: '=?',
        samplePrettyFields: '=?'
      },
      link: function(scope, element, attrs) {
        if (scope.samplesArray) {
          linkingFunction(scope, element, attrs, false);
        } else if (scope.plateCode) {
          linkingFunction(scope, element, attrs, true);
        }
      }
    };
  }
]);
