// Manages Timer UI and controls
var minTime = 5;
var maxTime = 120;
var startTime = 120;
class TimerManager {
	
	static initialize(){
		var timerTime = document.getElementById("timer-time");
		timerTime.innerHTML = TimerManager.formatTime(startTime, 0);

		var x = TimerManager.timeToPosition(startTime);
		TimerManager.setTimerSliderPosition(x);
		TimerManager.setTimerSliderControlPosition(x);
	}


	static formatTime(minutes, seconds){
		if(seconds < 10){
			seconds = "0" + seconds;
		}
		return [minutes, ":", seconds].join("");
	}

	static positionToTime(x){

	}

	static timeToPosition(time){
		var segments = (maxTime - minTime)/5 + 1;
		var segmentNumber = (time - minTime)/5;

		var timerSlider = document.getElementById("timer-slider");
		var width = timerSlider.getBoundingClientRect().width;
		var segmentWidth = width/segments;

		return segmentWidth * segmentNumber;
	}

	static setTimerSliderPosition(x){
		var timerSlider = document.getElementById("timer-slider");
		timerSlider.style.width = x + "px";
	}

	static setTimerSliderControlPosition(x){
		var timerSliderControl = document.getElementById("timer-slider-control");
		timerSliderControl.style.transform = ["translate(", x, "px, 0px)"].join("");
	}
}