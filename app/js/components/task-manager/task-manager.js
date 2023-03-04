import { v4 as uuidv4 } from "uuid"
import Popup from "./popup"
import sendToServer from "../../services/service"

export default class TaskManager {
	constructor(parrentSelector, addBtn) {
		this.parrentSelectorDomEl = document.querySelector(parrentSelector)
		this.addBtnDomEl = document.querySelector(addBtn)

		this.tickets = []
	}

	async init() {
		try {
			this.tickets = await sendToServer("get")
		} catch (error) {
			console.log(error)
		}

		if (this.tickets.length !== 0) {
			this.renderTaskList()
		}

		this.addEvents()
	}

	renderTaskList() {
		if (!this.taskList) {
			this.taskList = document.createElement("ul")
			this.taskList.classList.add("taskmanager__list")
			this.parrentSelectorDomEl.appendChild(this.taskList)
		}

		this.taskList.innerHTML = ""
		this.popup = null

		if (this.tickets.length === 0) {
			this.taskList.remove()
		}

		this.tickets.forEach(ticket => this.taskList.appendChild(this.createTaskItem(ticket)))
	}

	createTaskItem({ id, status, title, created }) {
		const taskItem = document.createElement("li")
		taskItem.classList.add("taskmanager__item")
		taskItem.dataset.id = `${id}`

		taskItem.innerHTML = `
            <div class="taskmanager__item-top">
                <div class="taskmanager__item-top-left">
					<label class="taskmanager__item-check ${status ? "custom-check--active" : ""}">
						<input type="checkbox" />
					</label>
                    <h2 class="taskmanager__item-title">${title}</h2>
                </div>
                <div class="taskmanager__item-top-right">
                    <p class="taaskmanager__item-created">${created}</p>
                    <div class="taskmanager__item-buttons"><button class="taskmanager__item-edit"></button><button class="taskmanager__item-delete"></button></div>
                </div>
            </div>
            <div class="taskmanager__item-bottom">
                <p class="taskmanager__item-description">Описание</p>
            </div>
        `
		taskItem.querySelector(".taskmanager__item-check input").checked = status
		this.addEventForTaskItem(taskItem)

		return taskItem
	}

	collectFullData({ textData, id, status = false }, eventElement = false) {
		const data = {}
		data.id = id || uuidv4()

		if (textData) {
			data.title = textData.title
			data.description = textData.description
		}

		if (this.method === "add") {
			const date = new Date()
			const year = date.getFullYear().toString()
			const dMY = `${date.getDate() < 10 ? `0${date.getDay()}` : date.getDay()}.${
				date.getMonth() < 9 ? `0${date.getMonth() + 1}` : date.getMonth() + 1
			}.${year[2]}${year[3]}`

			data.created = `${dMY} ${date.getHours()}:${date.getMinutes()}`
		}

		data.status = status

		this.choiseMehodtoSend(data, eventElement)
	}

	async choiseMehodtoSend(data, eventElement) {
		if (this.method === "add") {
			try {
				const result = await sendToServer("add", data)

				this.tickets.push(data)

				console.log(`добавлено ${result}`)
			} catch (error) {
				console.log("Не получилось добавить задачу")
			} finally {
				this.renderTaskList()
			}

			return
		}

		if (this.method === "delete") {
			try {
				const idDeleteIndex = await sendToServer("delete", data)

				this.tickets.splice(idDeleteIndex, 1)

				console.log(`удалено ${idDeleteIndex}`)
			} catch (error) {
				console.log("Не получилось удалить задачу")
			} finally {
				this.renderTaskList()
			}

			return
		}

		if (this.method === "edit") {
			try {
				const idEditIndex = await sendToServer("edit", data)

				this.tickets[idEditIndex].title = data.title
				this.tickets[idEditIndex].description = data.description

				console.log(`отредактировано ${idEditIndex}`)
			} catch (error) {
				console.log(error)
				console.log("Не получилось отредактировать задачу")
			} finally {
				this.renderTaskList()
			}

			return
		}

		if (this.method === "check") {
			try {
				const idCheckIndex = await sendToServer("check", data)

				eventElement.classList.toggle("custom-check--active")

				console.log(`отмечено ${idCheckIndex}`)
			} catch (error) {
				console.log(error)
				console.log("Не получилось отметить задачу")
			}

			return
		}

		if (this.method === "getId") {
			let getDescription
			try {
				if ((eventElement && !eventElement.classList.contains("show")) || this.popup) {
					getDescription = await sendToServer("getId", data)
					console.log(`Получено описание ${getDescription}`)
				}

				if (!this.popup) {
					eventElement.querySelector(".taskmanager__item-description").textContent = getDescription
				}
			} catch (error) {
				console.log(error)
				console.log("Не получилось получить описание")

				if (this.popup) {
					this.popup.querySelector(".taskmanager-popup__form-long input").value = "Опиасание не было получено, попробуйте позже"
					return
				}

				eventElement.classList.toggle("show")
				eventElement.querySelector(".taskmanager__item-description").textContent = "Опиасание не было получено, попробуйте позже"
			} finally {
				if (this.popup) {
					this.popup.querySelector(".taskmanager-popup__form-long input").value = getDescription
				} else {
					eventElement.classList.toggle("show")
				}
			}
		}
	}

	collectTextData() {
		const inputs = [...this.popup.querySelectorAll("input")]

		for (const inp of inputs) {
			if (inp.value === "") {
				return false
			}
		}
		const title = this.popup.querySelector(".taskmanager-popup__form-short input").value
		const description = this.popup.querySelector(".taskmanager-popup__form-long input").value

		return { title, description }
	}

	addEventForTaskItem(item) {
		item.addEventListener("click", async e => {
			if (e.target.closest(".taskmanager__item-check")) {
				return
			}

			e.preventDefault()

			if (this.popup) {
				this.popup = null
			}

			if (e.target.closest(".taskmanager__item-edit")) {
				console.log(this.popup)
				if (!this.popup) {
					this.popup = new Popup("body", "edit").init()

					const ticketTitle = item.querySelector(".taskmanager__item-title").textContent

					this.popup.querySelector(".taskmanager-popup__form-short input").value = ticketTitle

					this.method = "getId"

					this.collectFullData({ id: item.dataset.id })

					if (this.popup.querySelector(".taskmanager-popup__form-long input").value !== "") {
						this.method = "edit"

						this.createPopup(item.dataset.id)
					}
				}
			} else if (e.target.closest(".taskmanager__item-delete")) {
				if (!this.popup) {
					this.popup = new Popup("body", "delete").init()

					this.method = "delete"

					this.createPopup(item.dataset.id)
				}
			} else {
				this.method = "getId"

				this.collectFullData({ id: item.dataset.id }, item.querySelector(".taskmanager__item-bottom"))
			}
		})

		item.querySelector(".taskmanager__item-check input").addEventListener("change", e => {
			this.method = "check"

			this.collectFullData(
				{ id: item.dataset.id, status: item.querySelector(".taskmanager__item-check input").checked },
				e.target.closest(".taskmanager__item-check")
			)
		})
	}

	createPopup(id = undefined) {
		if (this.popup) {
			this.popup.addEventListener("click", e => {
				if (e.target.closest(".taskmanager-popup__form-submit")) {
					const textData = this.collectTextData()

					if (!textData && this.method !== "delete") {
						return
					}

					this.popup.remove()

					this.collectFullData({ textData, id })
				}
			})
		}
	}

	addEvents() {
		document.querySelector(".taskmanager__button").addEventListener("click", e => {
			e.preventDefault()
			this.popup = new Popup("body", "add").init()
			this.method = "add"
			this.createPopup()
		})
	}
}
