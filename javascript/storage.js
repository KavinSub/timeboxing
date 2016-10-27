var tasksKey = "tasks"; // localStorage[tasksKey] -> [Task]
var timeboxesKey = "timebox"; // prefix for timebox storage 

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

	// Description: Stores key value pair
	// Arguments:
	// [1] key
	// [2] value - Must be number or string
	// Return Value: None
	static set(key, value){
		localStorage.setItem(key, value);
	}

	// Description: Retrieves value stored at key
	// [1] key
	// Return Value: Value stored at key
	static get(key){
		return localStorage.getItem(key);
	}

	// Description: Completely clears out local storage. Use with caution.
	// Arguments: None
	// Return Value: None
	static clear(){
		localStorage.clear();
	}

	// Description: Removes (key, value) from local storage.
	// Arguments:
	// [1] key
	// Return Value: None
	static removeItem(key){
		localStorage.removeItem(key);
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

class TimeboxStorageHelper {

	static storeTimeboxAtDate(timebox){
		var year = timebox.dateCreated.getFullYear();
		var month = timebox.dateCreated.getMonth();
		var date = timebox.dateCreated.getDate();

		var key = [timeboxesKey, year, month, date].join("-");

		var currentTime = Storage.get(key);
		currentTime = currentTime ? parseInt(currentTime):0;
		currentTime += timebox.length;

		Storage.set(key, currentTime);
		return key;		
	}

	static storeTimeboxAtTime(timebox){
		var day = timebox.getDate();
		var hour = timebox.getHours();

		var key = [timeboxesKey, day, hour].join("-");

		var currentTime = Storage.get(key);
		currentTime = currentTime ? parseInt(currentTime):0;
		currentTime += timebox.length;

		Storage.set(key, currentTime);
		return key;
	}

	static getTimeAtDate(date){
		var year = date.getFullYear();
		var month = date.getMonth();
		var date = date.getDate();

		var key = [timeboxesKey, year, month, date].join("-");

		return Storage.get(key);
	}

}