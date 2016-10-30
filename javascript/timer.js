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

		TimerStateMachine.initialize();
	}

	// Called on window resize
	static reinitialize(){
		maxWidth = document.getElementById("timer").getBoundingClientRect().width;
		if(state == "READY"){
			var x = TimerManager.timeToPosition(currentTime);

			TimerManager.setTimerSliderPosition(x);
			TimerManager.setTimerSliderControlPosition(x);
		}else{
			var time = runningTime;

			var minutes = Math.floor(time/60);
			var seconds = time % 60;

			var timerTime = document.getElementById("timer-time");
			timerTime.innerHTML = TimerManager.formatTime(minutes, seconds);

			TimerManager.setTimerSliderState(time);
		}
	}

	// Set slider remaining based on timer width, time remaining
	static setTimerSliderState(time){
		var percentage = time/(currentTime * 60);
		var width = percentage * maxWidth;

		TimerManager.setTimerSliderPosition(width);
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

var state = "READY";
var timeStart;
var runningTime;

var playButton = document.getElementById("play-button");
var pauseButton = document.getElementById("pause-button");
var stopButton = document.getElementById("stop-button");

var countdownTimer;

class TimerStateMachine {
	static initialize(){

		playButton.addEventListener("click", TimerStateMachine.play);
		pauseButton.addEventListener("click", TimerStateMachine.pause);
		stopButton.addEventListener("click", TimerStateMachine.stop);

		pauseButton.style.display = "none";
		stopButton.style.display = "none";
	}

	static play(){

		if(state == "READY"){

			playButton.style.display = "none";
			pauseButton.style.display = "";
			stopButton.style.display = "";
			document.getElementById("timer-slider-control").style.display = "none";

			TimerManager.setTimerSliderPosition(maxWidth);

			runningTime = currentTime * 60;

			countdownTimer = setInterval(TimerStateMachine.tick, 1000);

			timeStart = new Date().getTime();

			state = "RUNNING";
		}

		if(state == "PAUSED"){
			playButton.style.display = "none";
			pauseButton.style.display = "";
			stopButton.style.display = "";

			countdownTimer = setInterval(TimerStateMachine.tick, 1000);

			state = "RUNNING";
		}
	}

	static pause(){
		if(state == "RUNNING"){
			playButton.style.display = "";
			pauseButton.style.display = "none";
			stopButton.style.display = "";

			clearInterval(countdownTimer);

			state = "PAUSED";
		}
	}

	static stop(){
		if(state == "RUNNING" || state == "PAUSED" || state == "READY"){
			playButton.style.display = "";
			pauseButton.style.display = "none";
			stopButton.style.display = "none";

			clearInterval(countdownTimer);

			document.getElementById("timer-time").innerHTML = TimerManager.formatTime(currentTime, 0);
			TimerManager.setTimerSliderPosition(TimerManager.timeToPosition(currentTime));
			document.getElementById("timer-slider-control").style.display = "";

			state = "READY";
		}
	}

	static tick(){
		if(runningTime > 0){
			runningTime = (currentTime * 60) - Math.floor(((new Date).getTime() - timeStart)/1000);
			if(runningTime < 0){
				runningTime = 0;
			}

			// Update display
			document.getElementById("timer-time").innerHTML = TimerManager.formatTime(Math.floor(runningTime/60), runningTime % 60);

			// Update slider
			TimerManager.setTimerSliderState(runningTime);
		}else {
			TimerStateMachine.end();
		}
	}

	static end(){
		var audio = new Audio('./assets/audio/alarm.mp3');
		audio.play();

		var timebox = new Timebox(currentTime);
		TimeboxStorageHelper.storeTimebox(timebox);
		TimeboxManager.updateViews();
		TimerStateMachine.stop();
	}
}