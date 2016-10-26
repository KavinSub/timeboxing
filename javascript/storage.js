var tasksKey = "tasks"; // localStorage[tasksKey] -> [Task]
var timeboxesKey = "timeboxes"; 

class Storage {

	// Description: Retrieves all objects from local storage.
	// Arguments:
	// [1] objectKey
	// Return Value: [Object]
	static getObjects(objectKey){
		var objects = JSON.parse(localStorage.getItem(objectKey));
		if(objects === null){
			objects = [];
		}
		return objects;
	}

	// Description: Adds a new object to local storage.
	// Arguments: 
	// [1] object - The object to be added
	// Return Value: None
	static addNewObject(objectKey, object){
		var objects = Storage.getObjects(objectKey);
		objects.push(object);
		Storage.setObjects(objectKey, objects);
	}

	// Description: Sets an objects array to local storage.
	// Arguments:
	// [1] objects - Objects array to set
	// Return value: None
	static setObjects(objectKey, objects){
		localStorage.setItem(objectKey, JSON.stringify(objects));
	}

	// Description: Clears all stored tasks.
	// Arguments:
	// [1] objectKey
	// Return Value: None
	static clearObjects(objectKey){
		var emptyArray = [];
		localStorage.setItem(objectKey, JSON.stringify(emptyArray));
	}

}


// Helper class for dealing directly with tasks
class TaskStorageHelper {

	static getTasks(){
		return Storage.getObjects(tasksKey);
	}

	static getTaskById(id){
		var tasks = TaskStorageHelper.getTasks();
		for(var i = 0; i < tasks.length; i++){
			var task = tasks[i];
			if(id == task.id){
				return task;
			}
		}
		return null;
	}

	static toggleTaskWithId(id){
		var tasks = TaskStorageHelper.getTasks();
		for(var i = 0; i < tasks.length; i++){
			var task = tasks[i];
			if(id == task.id){
				tasks[i].completed = !task.completed;
			}
		}
		TaskStorageHelper.setTasks(tasks);
	}

	static deleteTaskWithId(id){
		var tasks = TaskStorageHelper.getTasks();
		for(var i = 0; i < tasks.length; i++){
			if(tasks[i].id == id){
				tasks.pop(i);
			}
		}
		TaskStorageHelper.setTasks(tasks);
	}

	static addNewTask(task){
		Storage.addNewObject(tasksKey, task);
	}

	static setTasks(tasks){
		Storage.setObjects(tasksKey, tasks);
	}

	static clearTasks(){
		Storage.clearObjects(tasksKey);
	}
}