

angular.module('projects').controller('GraphController', ['$scope', '$http', '$state', 'Authentication', 'Menus', 
  function ($scope, $http, $state, Authentication, Menus) {

$scope.authentication = Authentication;

  platedata = [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]]; 
	// This needs to be a double array like this because of the way angular-chart.js
	// is set up. It wants to do multiple series of bars and we only need one. Thus, 
	// platedata[0] is the way to go. 
	
	$scope.labels = ['Pending Arrival', 'Sample Arrived', 'Quality Control 1', 'Shearing', 
			'Library Preparation', 'Quality Control 2', 'Hybridization', 'Quality Control 3', 
			'Sequencing', 'Data Analysis', 'Completed'];
  $scope.series = ['Series A'];

  $scope.data = platedata; // Need to update this every time we get a new project. 

  /*
    datasets: [
        {
            label: "Plates Information",
            fillColor: ["#b2b3b4", "#b2b3b4", "#b2b3b4", "#b2b3b4", "#b2b3b4", "#b2b3b4", 
			"#b2b3b4", "#b2b3b4", "#b2b3b4", "#ff2b00"], 
            strokeColor: "#000000",
            highlightFill: ["#ff9966", "#ff9966", "#ff9966", "#ff9966", "#ff9966", "#ff9966", 
			"#ff9966", "#ff9966", "#ff9966", "#ff8000"], 
            highlightStroke: "#000000",
            data: [512, 256, 128, 64, 32, 32, 64, 128, 256, 512]
        }
    ] */ 

	$scope.getUserProjects = function() {
			if ($scope.authentication)
		    platedata[0] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

	// console.log($scope.hello);

//	hello[0].plates.stage; 

    	for (var q in $scope.$parent.currentProject.plates) {
    		if ($scope.$parent.currentProject.plates[q].stage >= 11) {
				platedata[0][10]++;
    		  platedata[0][$scope.$parent.currentProject.plates[q].stage]++;
        }
    	} //temporary... 
    	
		$scope.data = platedata; 
		
		// options 
		// var moneymoney = new Chart(document.getElementById("canvas").getContext("2d")).Bar($scope.data);

		
		
	};

	

//	console.log(platedata);


// var platedata = [25, 17, 6, 18, 9, 1, 15, 0, 12, 8, 10]; // this will be an array of numbers provided from mongo
// var max = 0;
// for (var i in platedata)
// 	if (platedata[i] > max)
// 		max = platedata[i];

/*	
	$scope.data = {

	labels: ["Pending Arrival", "Sample Arrived", "Quality Control 1", "Shearing", 
			"Library Preparation", "Quality Control 2", "Hybridization", "Quality Control 3", 
			"Sequencing", "Data Analysis"], 

};

*/
	
	/*
var data = {

	labels: ["Pending Arrival", "Sample Arrived", "Quality Control 1", "Shearing", 
			"Library Preparation", "Quality Control 2", "Hybridization", "Quality Control 3", 
			"Sequencing", "Data Analysis"], 

    datasets: [
        {
            label: "Plates Information",
            fillColor: ["#b2b3b4", "#b2b3b4", "#b2b3b4", "#b2b3b4", "#b2b3b4", "#b2b3b4", 
			"#b2b3b4", "#b2b3b4", "#b2b3b4", "#ff2b00"], 
            strokeColor: "#000000",
            highlightFill: "#666666",
            highlightStroke: "#000000",
            data: [512, 256, 128, 64, 32, 32, 64, 128, 256, 512]
		//	data: {{platedata}} 
        }
    ]
}; 

var chart = new Chart(document.getElementById("canvas").getContext("2d")).Bar(data);
 */ 
	



  }]);
