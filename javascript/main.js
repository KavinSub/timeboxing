var inputFieldId = "task-field";

window.onload = initialize;
window.onresize = reinitialize;

// Anything that must be done on first time load
function initialize(){
	// Task related functions
	initializeTasks();
	taskInputDisableCopyPaste();
	taskInputEnterAction();

	// Stats related functions
	CalendarView.drawCalendar();
}

// Anything that must be done on window resize
function reinitialize(){
	console.log("resize");
	CalendarView.clearCalendar();
	CalendarView.drawCalendar();
}

function initializeTasks(){
	var tasks = TaskStorageHelper.getTasks();
	for(var i = 0; i < tasks.length; i++){
		TaskManager.addTask(tasks[i]);
	}
}

// Disables copy pasting in the task input field
function taskInputDisableCopyPaste(){
	var inputField = document.getElementById(inputFieldId);
	inputField.onpaste = function(e){
		e.preventDefault();
	}
}

// Adds action when Enter key is pressed when Task Input has focus
function taskInputEnterAction(){
	var inputField = document.getElementById(inputFieldId);
	inputField.addEventListener("keyup", function(e){
		if(e.keyCode == 13){
			var text = inputField.value;
			inputField.value = "";
			var task = new Task(text);
			TaskStorageHelper.addNewTask(task);
			TaskManager.addTask(task);
		}
	});
}