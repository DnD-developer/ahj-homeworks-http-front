export default class Popup {
	constructor(parrentSelector, method) {
		this.parrentDomEl = document.querySelector(parrentSelector)
		this.method = method
	}

	init() {
		this.popup = document.createElement("div")
		this.popup.classList.add("taskmanager-popup")

		if (this.method === "delete") {
			this.popup.classList.add("delete-task")
		}

		let titleTicket

		switch (this.method) {
			case "add":
				titleTicket = "Добавить"
				break

			case "edit":
				titleTicket = "Изменить"
				break

			case "delete":
				titleTicket = "Удалить"
				break

			default:
				break
		}

		this.popup.innerHTML = `
            <form class="taskmanager-popup__form" name="taskmanager-form>
                <h2 class="taskmanager-popup__form-title">${titleTicket} тикет</h2>
                    <label class="taskmanager-popup__form-short">Краткое описание
                        <input name="short-description" type="text" />
                    </label>
                    <label class="taskmanager-popup__form-long">Подробное описание
                        <input name="long-description" type="text" />
                    </label>
                <p class="taskmanager-popup__form-delete">Вы уверены, что хотите удалить тикет. Это действие необратимо</p>
                <div class="taskmanager-popup__form-buttons">
                    <button class="taskmanager-popup__form-reset">Отмена</button>
                    <button class="taskmanager-popup__form-submit">Оk</button>
                </div>
            </form>
        `

		this.parrentDomEl.appendChild(this.popup)

		this.addEvents()

		return this.popup
	}

	addEvents() {
		this.popup.addEventListener("click", e => {
			e.preventDefault()

			if (e.target.classList.contains("taskmanager-popup") || e.target.closest(".taskmanager-popup__form-reset")) {
				this.popup.remove()
			}
		})

		this.popup.addEventListener("submit", e => {
			e.preventDefault()
		})
	}
	remove() {
		this.popup.remove()
	}
}
