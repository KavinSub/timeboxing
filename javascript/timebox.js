class Timebox {
	constructor(length){
		this.length = length;
		var today = new Date();
		this.dateCreated = new Date(
			today.getFullYear(), 
			today.getMonth(), 
			today.getDate(), 
			today.getHours(), 
			today.getMinutes() - length);
	}
}

class TimeboxManager {

	// Should be called upon timebox completion
	static updateViews(timebox){
		CalendarView.setTimeAtDate(new Date()); // Only update today's box
		BubbleChartView.redrawChart();
	}

}

class CalendarView {

	static drawCalendar(){
		CalendarView.drawGrid();
		CalendarView.drawNumbers();
		CalendarView.setTimeThisMonth();
		CalendarView.setHeader();
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
			var fontSize = Math.floor(1.8 * CalendarView.getDaySize()/8);
			text.setAttribute("font-size", fontSize);
			text.setAttribute("y", fontSize);
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

	static setHeader(){
		var today = new Date();
		var header = [CalendarView.getMonth(today.getMonth()), today.getFullYear()].join(" ");

		var calendarHeader =  document.getElementById("calendar-header");
		calendarHeader.innerHTML = header;
	}

	static updateTimeboxToday(){
		CalendarView.setTimeAtDate(new Date());
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

	// Helper function, returns the name of a month given the number
	static getMonth(monthNumber){
		var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "Novemeber", "December"];
		return months[monthNumber];
	}

	// Removes all child elements of calendar svg
	static clearCalendar(){
		var calendar = document.getElementById("calendar");
		while(calendar.firstChild){
			calendar.removeChild(calendar.firstChild);
		}
	}

}

class BubbleChartView {

	static drawBubbleChart(){
		BubbleChartView.drawGrid();
		BubbleChartView.drawLabels();
		BubbleChartView.drawBubbles();
	}

	// [1] Draw horizontal lines
	// [2] Draw vertical lines
	// [3] Add group elements
	static drawGrid(){
		var chart = document.getElementById("bubble-chart");
		var box = BubbleChartView.getBoxDimensions();

		// [1]
		for(var i = 0; i <= 7; i++){
			var line = document.createElementNS("http://www.w3.org/2000/svg", "line");
			line.setAttribute("x1", 0);
			line.setAttribute("y1", i * box.height);
			line.setAttribute("x2", box.width * 24);
			line.setAttribute("y2", i * box.height);
			line.setAttribute("stroke-width", 2);
			line.setAttribute("stroke", "#383F51");
			chart.appendChild(line);
		}

		// [2]
		var tickSize = 0.2 * box.height;
		for(var i = 0; i <= 24; i++){
			if(i == 0 || i == 24){
				var line = document.createElementNS("http://www.w3.org/2000/svg", "line");
				line.setAttribute("x1", i * box.width);
				line.setAttribute("y1", 0);
				line.setAttribute("x2", i * box.width);
				line.setAttribute("y2", 7 * box.height);
				line.setAttribute("stroke-width", 2);
				line.setAttribute("stroke", "#383F51");
				chart.appendChild(line);
			}else{
				for(var j = 0; j < 7; j++){
					var upperTick = document.createElementNS("http://www.w3.org/2000/svg", "line");
					upperTick.setAttribute("x1", i * box.width);
					upperTick.setAttribute("y1", j * box.height);
					upperTick.setAttribute("x2", i * box.width);
					upperTick.setAttribute("y2", j * box.height + tickSize);
					upperTick.setAttribute("stroke-width", 1);
					upperTick.setAttribute("stroke", "#383F51");
					chart.appendChild(upperTick);
				}
			}
		}

		// [3]
		for(var i = 0; i < 7; i++){
			for(var j = 0; j < 24; j++){
				var g = document.createElementNS("http://www.w3.org/2000/svg", "g");
				g.setAttribute("id", ["bc-", i, ",", j].join(""));
				g.setAttribute("transform", ["translate(", j * box.width - box.width, ",", i * box.height, ")"].join(""));
				chart.appendChild(g);
			}
		}
	}

	// [1] Draw y-axis labels
	// [2] Draw x-axis labels
	static drawLabels(){
		var chart = document.getElementById("bubble-chart");
		var box = BubbleChartView.getBoxDimensions();
		
		// [1]
		var labels = ["S", "M", "T", "W", "T", "F", "S"];
		for(var i = 0; i < labels.length; i++){
			var text = document.createElementNS("http://www.w3.org/2000/svg", "text");
			text.innerHTML = labels[i];
			text.setAttribute("font-size", box.height/5);
			text.setAttribute("color", "#383F51");
			text.setAttribute("x", 2);
			text.setAttribute("y", i * box.height + box.height/2 + box.height/10);
			chart.appendChild(text);
		}

		// [2]
		var suffix = ["a", "p"];
		for(var i = 0; i < 24; i++){
			var text = document.createElementNS("http://www.w3.org/2000/svg", "text");
			var hour = i % 12 ? i % 12:12;
			text.innerHTML = hour + suffix[Math.floor(i/12)];
			text.setAttribute("font-size", box.height/5);
			text.setAttribute("color", "#383F51");
			text.setAttribute("x", i * box.width + box.width/2 - box.height/10);
			text.setAttribute("y", 7 * box.height - 2);
			chart.appendChild(text);
		}	
	}

	static getBoxDimensions(){
		var chart = document.getElementById("bubble-chart");
		var rect = chart.getBoundingClientRect();
		return {
			height: rect.height/7,
			width: rect.width/24
		};
	}

	// Returns timebox data in a format that is readily used by drawBubbles
	static getDataset(){
		var days = 7;
		var hours = 24;
		var min = 0;
		var max = 0;

		var data = [];

		for(var day = 0; day < days; day++){
			for(var hour = 0; hour < hours; hour++){
				var time = TimeboxStorageHelper.getTimeboxesAtTime(day, hour);
				if(time != null){
					if(time != 0){
						if(min != 0){
							min = Math.min(time, min);
						}else{
							min = time;
						}
						max = Math.max(time, max);
					}
					data.push(parseInt(time));
				}else{
					data.push(0);
				}
			}
		}
		return {
			data: data,
			min: min,
			max: max
		};
	}

	// [1] Compute radii range
	// [2] Draw bubbles
	static drawBubbles(){
		var dataset = BubbleChartView.getDataset();
		if(dataset.min == 0 && dataset.max == 0){
			return;
		}
		var box = BubbleChartView.getBoxDimensions();

		// [1]
		var minRadius = box.width/8;
		var maxRadius = box.width/2;

		// [2]
		for(var day = 0; day < 7; day++){
			for(var hour = 0; hour < 24; hour++){
				var time = dataset.data[day * 24 + hour];
				var group = document.getElementById(["bc-", day, ",", hour].join(""));
				if(time != 0){ // Only draw bubbles that have positive time
					var circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
					circle.setAttribute("cx", box.width/2);
					circle.setAttribute("cy", box.height/2);
					if(dataset.max != dataset.min){
						circle.setAttribute("r", minRadius + ((time - dataset.min)/(dataset.max - dataset.min)) * (maxRadius - minRadius));
					}else{
						circle.setAttribute("r", (minRadius + maxRadius)/2);
					}
					var fraction = ((time - dataset.min)/(dataset.max - dataset.min));
					circle.setAttribute("fill", "#FF3C38");

					group.appendChild(circle);
				}
			}
		}
	}

	static clearChart(){
		var chart = document.getElementById("bubble-chart");
		while(chart.firstChild){
			chart.removeChild(chart.firstChild);
		}
	}

	static redrawChart(){
		BubbleChartView.clearChart();
		BubbleChartView.drawBubbleChart();
	}

}