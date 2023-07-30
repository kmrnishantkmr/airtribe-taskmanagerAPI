class validator {
    static validateTaskInfo(TaskInfo, taskData) {
      if(TaskInfo.hasOwnProperty("Task") &&
        TaskInfo.hasOwnProperty("USER") &&
        TaskInfo.hasOwnProperty("TaskId") &&
        TaskInfo.hasOwnProperty("%CPU") &&
        TaskInfo.hasOwnProperty("%MEM") &&
        TaskInfo.hasOwnProperty("TTY") &&
        TaskInfo.hasOwnProperty("STAT") &&
        TaskInfo.hasOwnProperty("START") && this.validateUniqueTaskId(TaskInfo, taskData)) {
          return {
            "status": true,
            "message": "Task has been added"
          };
        }
        if(!this.validateUniqueTaskId(TaskInfo, taskData)){
          return {
            "status": false,
            "message": "Task id has to be unique"
          };
        }
        return {
          "status": false,
          "message": "Please provide all the input related to the task"
        }
    }
  
    static validateUniqueTaskId(TaskInfo, taskData) {
      let valueFound = taskData.some(el => el.TaskId === TaskInfo.TaskId);
      if(valueFound) return false;
      return true;
    }
  
    static validateAverageRating(averageRating) {
      if(averageRating.hasOwnProperty("rating") && this.isInt(averageRating.rating)) {
        return true;
      }
      return false;
    }
  
    static isInt(value) {
      return !isNaN(value) && (function(x) { return (x | 0) === x; })(parseFloat(value))
    }
  }
  
  module.exports = validator;