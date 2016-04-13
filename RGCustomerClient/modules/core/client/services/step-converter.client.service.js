'use strict';

angular.module('core').factory('StepConverter', [
	function() {
		// Public API
		return {
			convertFromNumberToPlateSuffix: function(number) {
				var text = '';
				switch(number) {
				case 1:
					text = 'DNA';
					break;
				case 4:
					text = 'SHR';
					break;
				case 5:
					text = 'ENP';
					break;
				case 6:
					text = 'ADN';
					break;
				case 7:
					text = 'LIG';
					break;
				case 8:
					text = 'SZS';
					break;
				case 9:
					text = 'PCE';
					break;
				case 11:
					text = 'LIB';
					break;
				}
				return text;
			},
			convertFromNumber: function(number) {
				var text = '';
				switch(number) {
				case 0:
					text = 'Pending Arrival';
					break;
				case 1:
					text = 'Sample Arrival';
					break;
				case 2:
					text = 'Quality Control 1';
					break;
				case 3:
					text = 'Shearing';
					break;
				case 4:
					text = 'Shearing';
					break;
				case 5:
					text = 'Library Prep';
					break;
				case 6:
					text = 'Library Prep';
					break;
				case 7:
					text = 'Library Prep';
					break;
				case 8:
					text = 'Library Prep';
					break;
				case 9:
					text = 'Library Prep';
					break;
				case 10:
					text = 'Library Prep';
					break;
				case 11:
					text = 'Quality Control 2';
					break;
				case 12:
					text = 'Hybridization';
					break;
				case 13:
					text = 'Hybridization';
					break;
				case 14:
					text = 'Hybridization';
					break;
				case 15:
					text = 'Hybridization';
					break;
				case 16:
					text = 'Quality Control 3';
					break;
				case 17:
					text = 'Sequencing';
					break;
				case 18:
					text = 'Data Analysis';
					break;
				default:
					text = 'Completed';

				}
				return text;
			}
		};
	}
]);
