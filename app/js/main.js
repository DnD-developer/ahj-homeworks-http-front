import TaskManager from "./components/task-manager/task-manager"

document.addEventListener("DOMContentLoaded", () => {
	const mainTaskMansger = new TaskManager(".taskmanager")

	mainTaskMansger.init()
})
