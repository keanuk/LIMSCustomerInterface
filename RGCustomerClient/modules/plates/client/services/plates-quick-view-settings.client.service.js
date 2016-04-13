
'use strict';

angular.module('plates').factory('PlateQuickViewSettings', [/*'Plates',*/ 'lodash',
  function(/*Plates,*/ _) {

    // Public API
    return {
      defaults: function() {
        return [{
          name: 'uniqueClientCode',
          displayDataFunction: function(sample) {
            return sample.uniqueClientCode.substring(0, Math.min(6, sample.uniqueClientCode.length));
          }
        }, {
          name: 'customerConcentration',
          prettyName: 'Customer Concentration (ng/uL)',
          displayDataFunction: function(sample) {
            return sample.customerConcentration.toFixed(2);
          }
        }, {
          name: 'volume',
          prettyName: 'Customer Volume (uL)',
          displayDataFunction: function(sample) {
            return sample.volume.toFixed(2);
          }
        }, {
          name: 'gDNAQuantificationInfo',
          prettyName: 'RG DNA Concentration (ng/uL)',
          displayDataFunction: function(sample) {
            return _.last(sample.gDNAQuantificationInfo).concentration.toFixed(2);
          }
        }, {
          name: 'totalDNA',
          prettyName: 'Initial RG Total DNA (ng)',
          displayDataFunction: function(sample) {
            return sample.totalDNA.toFixed(2);
          }
        }, {
          name: 'currentTotalDNAInLab',
          prettyName: 'Current DNA In lab (ng)',
          displayDataFunction: function(sample) {
            return sample.currentTotalDNAInLab.toFixed(2);
          }
        }, {
          name: 'comment',
          displayDataFunction: function(sample) {
            return sample.comment.substring(0, Math.min(6, sample.comment.length));
          }
        }, {
          name: 'gDNAUsed',
          prettyName: 'gDNA Used in Norm. (ng)',
          displayDataFunction: function(sample) {
            return _.last(sample.normalizations).dnaUsed.toFixed(2);
          }
        }, {
          name: 'libraryDNAQuantificationInfo',
          prettyName: 'Library Concentration (ng / uL)',
          displayDataFunction: function(sample) {
            return _.last(sample.libraryDNAQuantificationInfo).concentration.toFixed(2);
          }
        }, {
          name: 'totalLibraryDNA',
          prettyName: 'Total Library DNA (ng)',
          displayDataFunction: function(sample) {
            return sample.totalLibraryDna;
          }
        }, {
          name: 'pcrEnrichmentInfo',
          prettyName: 'Pre-Capture PCR Cycles',
          displayDataFunction: function(sample) {
            return _.map(sample.pcrEnrichmentInfo, 'cycles').join();
          }
        }];
      }
    };
  }
]);
