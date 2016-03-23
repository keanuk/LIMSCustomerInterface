angular.module('projects').controller('GraphController', ['$scope', '$state', 'Authentication', 'Menus',
  function ($scope, $state, Authentication, Menus) { 

var platedata = [25, 17, 6, 18, 9, 1, 15, 0, 12, 8, 10]; // this will be an array of numbers provided from mongo 
var max = 0; 
for (i in platedata)
	if (platedata[i] > max)  
		max = platedata[i]; 

function BarGraph(ctx) {
	
  var that = this;
  var startArr;
  var endArr;
  var looping = false; 
		
  // Draw method updates the canvas with the current display
	var draw = function (arr) { 
	  
	  var numOfBars = platedata.length;
	  var barWidth = 30;
	  var barHeight = 30;
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
  this.maxValue;
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
		if (!looping) {	
		  loop();
		}
	  }
	}; 
}

  }]); 