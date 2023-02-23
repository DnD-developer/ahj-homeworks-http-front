export default class TaskManager {
	constructor(parrentSelector, addBtn) {
		this.parrentSelectorDomEl = document.querySelector(parrentSelector)
		this.addBtnDomEl = document.querySelector(addBtn)

		this.tickets = [
			{
				id: 1,
				title: "Поменять красуку в принтере",
				created: "10.03.19 08:40",
				status: true,
				description:
					"Ваше приложение должно реализовывать следующий функционал: Отображение всех тикетов Создание нового тикета Удаление тикета Изменение тикета Получение подробного описание тикета Отметка о выполнении каждого тикета"
			},
			{
				id: 2,
				title: "Поменять красуку в принтере",
				created: "10.03.19 08:40",
				status: false,
				description:
					"Ваше приложение должно реализовывать следующий функционал: Отображение всех тикетов Создание нового тикета Удаление тикета Изменение тикета Получение подробного описание тикета Отметка о выполнении каждого тикета"
			}
		]
	}

	init() {
		if (this.tickets.length !== 0) {
			this.renderTaskList()
		}
	}

	renderTaskList() {
		this.taskList = document.createElement("ul")
		this.taskList.classList.add("taskmanager__list")

		this.parrentSelectorDomEl.appendChild(this.taskList)

		this.tickets.forEach(ticket => this.taskList.appendChild(this.createTaskItem(ticket)))
	}

	createTaskItem({ id, status, title, created, description }) {
		const taskItem = document.createElement("li")
		taskItem.classList.add("taskmanager__item")
		taskItem.dataset.id = `${id}`

		taskItem.innerHTML = `
            <div class="taskmanager__item-top">
                <div class="taskmanager__item-top-left"><label class="taskmanager__item-check ${
									status ? "custom-check--active" : ""
								}"><input type="checkbox" /></label>
                    <h2 class="taskmanager__item-title">${title}</h2>
                </div>
                <div class="taskmanager__item-top-right">
                    <p class="taaskmanager__item-created">${created}</p>
                    <div class="taskmanager__item-buttons"><button class="taskmanager__item-edit"></button><button class="taskmanager__item-delete"></button></div>
                </div>
            </div>
            <div class="taskmanager__item-bottom">
                <p class="taskmanager__item-description">${description}</p>
            </div>
        `
		this.addEventForTaskItem(taskItem)

		return taskItem
	}

	addEventForTaskItem(item) {
		item.addEventListener("click", e => {
			e.preventDefault()

			if (e.target.closest(".taskmanager__item-edit")) {
				console.log("Модальное окно редактирвоания")
			} else if (e.target.closest(".taskmanager__item-check")) {
				e.target.closest(".taskmanager__item-check").classList.toggle("custom-check--active")
			} else if (e.target.closest(".taskmanager__item-delete")) {
				console.log("Модальное окно удаления")
			} else {
				item.querySelector(".taskmanager__item-bottom").classList.toggle("show")
			}
		})
	}
}
