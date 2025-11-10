// This file can be shared or copied between your services
export var TaskStatus;
(function (TaskStatus) {
    TaskStatus["Todo"] = "todo";
    TaskStatus["InProgress"] = "in_progress";
    TaskStatus["Blocked"] = "blocked";
    TaskStatus["Done"] = "done";
})(TaskStatus || (TaskStatus = {}));
export var TaskPriority;
(function (TaskPriority) {
    TaskPriority["Low"] = "low";
    TaskPriority["Medium"] = "medium";
    TaskPriority["High"] = "high";
    TaskPriority["Critical"] = "critical";
})(TaskPriority || (TaskPriority = {}));
