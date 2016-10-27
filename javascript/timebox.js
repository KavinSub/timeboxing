class Timebox {
	constructor(length){
		this.length = length;
		this.dateCreated = new Date();
	}
}

class TimeboxManager {

	// Should be called upon timebox completion
	static updateView(timebox){

	}

}

class CalendarView {

	static drawCalendar(){
		CalendarView.drawGrid();
		CalendarView.drawNumbers();
		CalendarView.setTimeThisMonth();
	}

	// [1] Determine the size of 1 calendar day
	// [2] Add the group elements
	// [3] Draw the lines
	static drawGrid(){
		// [1]
		var calendarId = "calendar";
		var calendar = document.getElementById(calendarId);
		var boxSide = calendar.getBoundingClientRect().width/7;
		var width = calendar.getBoundingClientRect().width;
		var height = calendar.getBoundingClientRect().height;

		// [2]
		for(var i = 0; i < 6; i++){
			for(var j = 0; j < 7; j++){
				var g = document.createElementNS("http://www.w3.org/2000/svg", "g");
				g.setAttribute("id", [i, ",", j].join(""));
				g.setAttribute("transform", ["translate(", j * boxSide, ",", i * boxSide, ")"].join(""));
				calendar.appendChild(g);
			}
		}

		// [3]
		for(var i = 0; i <= 7; i++){
			var line = document.createElementNS("http://www.w3.org/2000/svg", "line");
			line.setAttribute("x1", i * boxSide);
			line.setAttribute("y1", 0);
			line.setAttribute("x2", i * boxSide);
			line.setAttribute("y2", height);
			line.setAttribute("stroke-width", 2);
			line.setAttribute("stroke", "#383f51");
			calendar.appendChild(line);
		}

		for(var i = 0; i <= 6; i++){
			var line = document.createElementNS("http://www.w3.org/2000/svg", "line");
			line.setAttribute("x1", 0);
			line.setAttribute("y1", i * boxSide);
			line.setAttribute("x2", width);
			line.setAttribute("y2", i * boxSide);
			line.setAttribute("stroke-width", 2);
			line.setAttribute("stroke", "#383f51");
			calendar.appendChild(line);
		}
	}

	static drawNumbers(){
		var today = new Date();
		var year = today.getFullYear();
		var month = today.getMonth();

		var daysInMonth = new Date(year, month + 1, 0).getDate();
		var firstDay = new Date(year, month, 1).getDay();
		
		for(var i = 0; i < daysInMonth; i++){
			var x = (firstDay + i) % 7;
			var y = Math.floor((firstDay + i)/7);

			var group = document.getElementById([y, ",", x].join(""));

			var text = document.createElementNS("http://www.w3.org/2000/svg", "text");
			text.innerHTML = i + 1;
			text.setAttribute("font-size", 18);
			text.setAttribute("y", 18);
			text.setAttribute("x", 2);
			text.setAttribute("color", "#383F51");

			group.appendChild(text);
		}		
	}

	// [1] Get the time spent from local storage
	// [2] Draw the time bubbles
	static setTimeAtDate(date){
		// [1]
		var time = TimeboxStorageHelper.getTimeAtDate(date);
		if(time == null){
			time = 0;
		}

		// [2]
		var timeboxes = Math.floor(time/30);
		var coords = CalendarView.dateToCoordinates(date);
		var group = document.getElementById([coords.row, ",", coords.column].join(""));

		var boxSize = CalendarView.getDaySize();
		var bubbleScalingFactor = 0.75;
		var bubbleBoxSize = boxSize/8;
		var bubbleRadius = (bubbleBoxSize * bubbleScalingFactor)/2;

		for(var i = 0; i < timeboxes; i++){
			var row = Math.floor(i/8);
			var column = i % 8;
			var x = column * bubbleBoxSize;
			var y = (row + 2) * bubbleBoxSize;

			var circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
			circle.setAttribute("cx", x + bubbleBoxSize/2);
			circle.setAttribute("cy", y + bubbleBoxSize/2);
			circle.setAttribute("r", bubbleRadius);
			circle.setAttribute("fill", "#FF3C38");
			group.appendChild(circle);
		}
	}

	// Draws all the timeboxes for this month
	static setTimeThisMonth(){
		var today = new Date();
		var year = today.getFullYear();
		var month = today.getMonth();

		var daysInMonth = new Date(year, month + 1, 0).getDate();
		for(var i = 1; i <= daysInMonth; i++){
			CalendarView.setTimeAtDate(new Date(year, month, i));
		}
	}

	static dateToCoordinates(date){
		var year = date.getFullYear();
		var month = date.getMonth();
		var firstDay = (new Date(year, month, 1)).getDay();

		var row = Math.floor((firstDay + date.getDate() - 1)/7);
		var column = (firstDay + date.getDate() - 1) % 7;

		return {
			row: row,
			column: column
		};
	}

	static getDaySize(){
		var calendarId = "calendar";
		var calendar = document.getElementById(calendarId);

		return calendar.getBoundingClientRect().width/7;
	}

}

class BubbleChartView {

}