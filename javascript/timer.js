// Manages Timer UI and controls
var minTime = 5;
var maxTime = 120;
var mousedown = false;
var maxWidth = 0;
var currentTime = maxTime;
class TimerManager {
	
	static initialize(){
		var timerTime = document.getElementById("timer-time");
		timerTime.innerHTML = TimerManager.formatTime(currentTime, 0);

		var x = TimerManager.timeToPosition(currentTime);
		maxWidth = document.getElementById("timer").getBoundingClientRect().width;
		TimerManager.setTimerSliderPosition(x);
		TimerManager.setTimerSliderControlPosition(x);

		TimerManager.initializeSliderControls();
	}

	// Called on window resize
	static reinitialize(){
		var x = TimerManager.timeToPosition(currentTime);
		maxWidth = document.getElementById("timer").getBoundingClientRect().width;
		TimerManager.setTimerSliderPosition(x);
		TimerManager.setTimerSliderControlPosition(x);

		TimerManager.initializeSliderControls();
	}


	static formatTime(minutes, seconds){
		if(seconds < 10){
			seconds = "0" + seconds;
		}
		return [minutes, ":", seconds].join("");
	}

	static positionToTime(x){
		if(x > maxWidth){
			x = maxWidth;
		}else if(x < 0){
			x = 0;
		}

		var segments = (maxTime - minTime)/5 + 1;
		var container = document.getElementById("timer");
		var segmentWidth = container.getBoundingClientRect().width/segments;

		var segmentNumber = Math.floor(x/segmentWidth);

		return Math.min(minTime + 5 * segmentNumber, maxTime);
	}

	static timeToPosition(time){
		var segments = (maxTime - minTime)/5 + 1;
		var segmentNumber = (time - minTime)/5;

		var container = document.getElementById("timer");
		var width = container.getBoundingClientRect().width;
		var segmentWidth = width/segments;

		return segmentWidth * (segmentNumber + 1);
	}

	static setTimerSliderPosition(x){
		if(x > maxWidth){
			x = maxWidth;
		}else if(x < 0){
			x = 0;
		}

		var timerSlider = document.getElementById("timer-slider");
		timerSlider.style.width = x + "px";
	}

	static setTimerSliderControlPosition(x){
		var timerSliderControl = document.getElementById("timer-slider-control");

		if(x > maxWidth){
			x = maxWidth;
		}else if(x < 0){
			x = 0;
		}

		timerSliderControl.style.transform = ["translate(", x, "px, 0px)"].join("");
	}

	static setTimerTime(time){
		var timerTime = document.getElementById("timer-time");
		timerTime.innerHTML = TimerManager.formatTime(time, 0);
	}

	static initializeSliderControls(){
		var container = document.getElementById("timer");
		container.addEventListener("mousemove", function(e){
			if(mousedown){
				var x = e.clientX;

				var container = document.getElementById("timer");
				var box = container.getBoundingClientRect();
				var xRel = x - box.left;
				
				TimerManager.setTimerSliderPosition(xRel);

				var radius = document.getElementById("timer-slider-control").getBoundingClientRect().width/2;
				TimerManager.setTimerSliderControlPosition(xRel - radius);

				var time = TimerManager.positionToTime(xRel);
				currentTime = time;
				TimerManager.setTimerTime(time);
			}
		});

		container.addEventListener("touchmove", function(e){
			if(mousedown){
				var x = e.touches[0].pageX;
				var xRel = x - document.getElementById("timer").offsetLeft;

				TimerManager.setTimerSliderPosition(xRel);

				var radius = document.getElementById("timer-slider-control").getBoundingClientRect().width/2;
				TimerManager.setTimerSliderControlPosition(xRel - radius);

				var time = TimerManager.positionToTime(xRel);
				currentTime = time;
				TimerManager.setTimerTime(time);
			}
		});

		var slider = document.getElementById("timer-slider-control");
		slider.addEventListener("mousedown", function(){
			mousedown = true;
		});
		slider.addEventListener("touchstart", function(){
			mousedown = true;
		});

		var body = document.getElementById("body");
		body.addEventListener("mouseup", function(){
			mousedown = false;
		});
		body.addEventListener("touchend", function(){
			mousedown = false;
		});
	}
}