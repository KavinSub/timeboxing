// Stores id prefixes of task objects
var taskElements = {
	input: "task-field",
	listItem: "task",
	check: "task-flag",
	title: "task-title",
	remove: "task-remove"
}

class Task {
	constructor(title) {
		this.title = title;
		this.completed = false;
		this.id = Date.now();
	}
}

// For managing the task UI
class TaskManager {
	// Description: Adds a new task item the the list.
	// Arguments:
	// [1] task - The new task to add
	// Return Value: none
	// [1] Create new list item
	// [2] Add new task item to list
	static addTask(task){
		// [1]
		var taskItem = document.createElement("li");
		taskItem.className = taskElements.listItem;
		taskItem.id = taskElements.listItem + "-" + task.id;

		var taskFlag = document.createElement("div");
		taskFlag.className = taskElements.check;
		taskFlag.id = taskElements.check + "-" + task.id;
		taskFlag.addEventListener("click", TaskManager.toggleTask);

		var taskTitle = document.createElement("p");
		taskTitle.className = taskElements.title;
		taskTitle.className += " col-s-11";
		taskTitle.id = taskElements.title + "-" + task.id;
		taskTitle.innerHTML = task.title;

		if(task.completed){
			taskFlag.style.backgroundColor = "#FF3C38";
			taskTitle.style.textDecoration = "line-through";
		}

		var taskRemove = document.createElement("p");
		taskRemove.className = taskElements.remove;
		taskRemove.className += " col-s-1";
		taskRemove.innerHTML = "x";
		taskRemove.id = taskElements.remove + "-" + task.id;
		taskRemove.addEventListener("click", TaskManager.deleteTask);

		taskItem.appendChild(taskFlag);
		taskItem.appendChild(taskTitle);
		taskItem.appendChild(taskRemove);

		// [3]
		var taskList = document.getElementById("task-list");
		taskList.appendChild(taskItem);
	}

	// Description: Toggles a task.
	// Arguments:
	// [1] e - The event source object
	// Return Value: None
	// [1] Update the task currently being stored
	// [2] Update the UI
	static toggleTask(e){
		// [1]
		var taskFlag = e.srcElement || e.target;
		var prefix = taskElements.check + "-";
		var taskId = taskFlag.id.substring(prefix.length);

		var task = TaskStorageHelper.getTaskById(taskId);
		TaskStorageHelper.toggleTaskWithId(taskId);

		// [2]
		var taskTitle = document.getElementById(taskElements.title + "-" + taskId);

		task.completed = !task.completed;
		if(task.completed){
			taskFlag.style.backgroundColor = "#FF3C38";
			taskTitle.style.textDecoration = "line-through";
		}else {
			taskFlag.style.backgroundColor = "white";
			taskTitle.style.textDecoration = "";
		}
	}

	// Description: Deletes a task, removes it from the list.
	// Arguments:
	// [1] e - The event source object
	// Return Value: None
	// [1] Delete the task from Local Storage
	// [2] Update the UI, remove the list item
	static deleteTask(e){
		// [1]
		var taskRemove = e.srcElement || e.target;
		var prefix = taskElements.remove + "-";
		var taskId = taskRemove.id.substring(prefix.length);

		TaskStorageHelper.deleteTaskWithId(taskId);

		// [2]
		var taskItem = document.getElementById(taskElements.listItem + "-" + taskId);
		taskItem.parentNode.removeChild(taskItem);
	}

}