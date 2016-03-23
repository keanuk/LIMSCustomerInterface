angular.module('projects').controller('GraphController', ['$scope', '$http', '$state', 'Authentication', 'Menus',
  function ($scope, $http, $state, Authentication, Menus) { 

$scope.authentication = Authentication;
    
	var platedata; 
	
		$scope.getUserProjects = function() {
			if ($scope.authentication) {
				$http({
		      method: 'GET',
		      url: '/api/allowedprojects'
				})
				.then(function successCallback(response) {
			$scope.hello = {}; 
	        $scope.hello = response.data;
					console.log($scope.hello);
			
		platedata = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]; 		
	
	// console.log($scope.hello); 
	
//	hello[0].plates.stage; 
	
	for (var q in $scope.hello[0].plates) { 
		if ($scope.hello[0].plates[q].stage >= 11) 
			platedata[10]++; 
		platedata[$scope.hello[0].plates[q].stage]++; 
	}
	      			$scope.initGraph(); 
		
		  
		  }, function errorCallback(response) {
	        console.log('Error in retrieving projects');
	      });

			}
		};

	
//	console.log(platedata); 
	
  
// var platedata = [25, 17, 6, 18, 9, 1, 15, 0, 12, 8, 10]; // this will be an array of numbers provided from mongo 
var max = 0; 
for (var i in platedata)
	if (platedata[i] > max)  
		max = platedata[i]; 

$scope.BarGraph = function(ctx) {
	
  var that = this;
  var startArr;
  var endArr;
  var looping = false; 
		
  // Draw method updates the canvas with the current display
	var draw = function (arr) { 
	  
	  var numOfBars = platedata.length;
	  var barWidth = 30;
	  var barHeight = max;
	  var border = 2;
	  var ratio;
	  var maxBarHeight = max;
	  var gradient;
	  var largestValue = max;
	  var graphAreaX = 0;
	  var graphAreaY = 0;
	  var graphAreaWidth = that.width;
	  var graphAreaHeight = that.height;
	  var i;
	  var textAngle = 1; 
	  
		// Update the dimensions of the canvas only if they have changed
	  if (ctx.canvas.width !== that.width || ctx.canvas.height !== that.height) {
		ctx.canvas.width = that.width;
		ctx.canvas.height = that.height;
	  }
				
	  // Draw the background color
	  ctx.fillStyle = that.backgroundColor;
	  ctx.fillRect(0, 0, that.width, that.height);
					
	  // If x axis labels exist then make room	
	  if (that.xAxisLabelArr.length) {
		graphAreaHeight -= 40;
	  }
				
	  // Calculate dimensions of the bar
	  barWidth = graphAreaWidth / numOfBars - border * 2;
	  maxBarHeight = graphAreaHeight - 25; 
	  
	  // For each bar
	  for (i = 0; i < arr.length; i += 1) {
		// Set the ratio of current bar compared to the maximum
		if (that.maxValue) {
		  ratio = arr[i] / that.maxValue;
		} else {
		  ratio = arr[i] / largestValue;
		} 
		
		barHeight = ratio * maxBarHeight;
	  
		// Turn on shadow
		ctx.shadowOffsetX = 2;
		ctx.shadowOffsetY = 2;
		ctx.shadowBlur = 2;
		ctx.shadowColor = "#999";
						
		// Draw bar background
		ctx.fillStyle = "#333";			
		ctx.fillRect(that.margin + i * that.width / numOfBars,
		  graphAreaHeight - barHeight,
		  barWidth,
		  barHeight);
			
		// Turn off shadow
		ctx.shadowOffsetX = 0;
		ctx.shadowOffsetY = 0;
		ctx.shadowBlur = 0;

		// Draw bar color if it is large enough to be visible
		if (barHeight > border * 2) { 
			// Create gradient
		//	gradient = ctx.createLinearGradient(0, 0, 0, graphAreaHeight);
		//	gradient.addColorStop(1-ratio, that.colors[i % that.colors.length]);
		//	gradient.addColorStop(1, "#ffffff");

		ctx.fillStyle = that.colors[i];
			// Fill rectangle with gradient
			ctx.fillRect(that.margin + i * that.width / numOfBars + border,
			  graphAreaHeight - barHeight + border,
			  barWidth - border * 2,
			  barHeight - border * 2);
		}

		// Write bar value
		ctx.fillStyle = "#333";
		ctx.font = "bold 12px sans-serif";
		ctx.textAlign = "center";
		// Use try / catch to stop IE 8 from going to error town
		try {
		  ctx.fillText(parseInt(arr[i],10), 
			i * that.width / numOfBars + (that.width / numOfBars) / 2,
			graphAreaHeight - barHeight - 10);
		} catch (ex) {}
		// Draw bar label if it exists
//		ctx.rotate(textAngle*Math.PI/180);   
//		ctx.translate(10, 20); 
		if (that.xAxisLabelArr[i]) {					
		  // Use try / catch to stop IE 8 from going to error town				
		  ctx.fillStyle = "#000000";
		  ctx.font = "bold 12px sans-serif";
		  ctx.textAlign = "center"; 
		  try {
			ctx.fillText(that.xAxisLabelArr[i],
			  i * that.width / numOfBars + (that.width / numOfBars) / 2,
			  that.height - 10);
			} catch (ex) {} 
		  }
//		ctx.rotate(-textAngle*Math.PI/180); 
		} 
	  }; 

  // Public properties and methods
	
  this.width = 300;
  this.height = 150;	
  this.maxValue = 30; 
  this.margin = 5;
  this.colors = ["purple", "red", "green", "yellow"];
  this.curArr = []; 
  this.backgroundColor = "#fff";
  this.xAxisLabelArr = [];
  this.yAxisLabelArr = [];
  this.animationInterval = 100;
  this.animationSteps = 10;
	
  // Update method sets the end bar array and starts the animation
	this.update = function () { // changed this not to accept any parameters. 
  // it was called newArr, changed it to 'platedata' 
	  // If length of target and current array is different 
	  if (that.curArr.length !== platedata.length) {
		that.curArr = platedata;
		draw(platedata);
	  } else {
		// Set the starting array to the current array
		startArr = that.curArr;
		// Set the target array to the new array
		endArr = platedata;
		// Animate from the start array to the end array
//		if (!looping) {	
//		  loop();
//		}
	  }
	}; 
}; 

	$scope.initGraph = function () { 
	
	//	$scope.getUserProjects(); 
	
		function createCanvas(divName) {
			
			var div = document.getElementById(divName);
			var canvas = document.createElement('canvas');
			div.appendChild(canvas);
	//		if (typeof G_vmlCanvasManager !== 'undefined') { 
	//			canvas = G_vmlCanvasManager.initElement(canvas);
	//		}	
			var ctx = canvas.getContext("2d");
			return ctx;
		}
		
		var ctx = createCanvas('graphDiv');
		console.log(ctx); 
		var graph = new $scope.BarGraph(ctx); 
		console.log(graph); 
		graph.maxValue = 30;
		console.log(graph.maxValue); 
		graph.margin = 2;
		graph.width = window.innerWidth - 50; // does not resize. need to set these to 
		graph.height = window.innerHeight - 50; // the size of the div it's in. 
		// 50 is an arbitrary border margin space 
// 		graph.colors = ["#0000ff", "#00cc00", "#ffff00", "#ff0000", "#ff6600"];
//		graph.xAxisLabelArr = ["Blue", "Green", "Yellow", "Red", "Orange"];
		graph.colors = ["#4d4d4d", "#4d4d4d", "#4d4d4d", "#4d4d4d", "#4d4d4d", "#4d4d4d", "#4d4d4d", "#4d4d4d", "#4d4d4d", "#4d4d4d", "#ff2b00"];
		graph.xAxisLabelArr = 
		
		 ["PA", "SA", "QC1", "SH", "LP", "QC2", "HB", "QC3", "SQ", "DA", "Completed"]; 
		
		// ["Pending Arrival", "Sample Arrival", "Quality Control 1", "Shearing", 
		// "Library Prep", "Quality Control 2", "Hybridization", "Quality Control 3", "Sequencing", 
		// "Data Analysis", "Completed"];  
		
//		graph.draw(); 
		
		setInterval(function () {
			graph.update(); // arguments for this = numbers for bar heights. 
 		}, 1000); 

	};

  }]); 