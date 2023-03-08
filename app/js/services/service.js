function createLoader(loaderParrent) {
	const loader = document.createElement("div")
	loader.classList.add("loader")

	loader.innerHTML = "<p>Загрузка</p>"

	loaderParrent.appendChild(loader)

	return loader
}

export default async function sendToServer(methodToSend, bodyObject, loaderParrent) {
	let bodyToSend
	let method
	let postFix

	const loader = createLoader(loaderParrent)

	switch (methodToSend) {
		case "get":
			method = "GET"
			postFix = "allTickets"
			break
		case "getId":
			method = "GET"
			postFix = `ticketById&id=${bodyObject.id}`
			break
		case "edit":
			method = "POST"
			postFix = `editTicket&id=${bodyObject.id}`
			break
		case "delete":
			method = "POST"
			postFix = `deleteTicket&id=${bodyObject.id}`
			break
		case "add":
			method = "POST"
			postFix = "createTicket"
			break
		case "check":
			method = "POST"
			postFix = `checkTicket&id=${bodyObject.id}`
			break
		default:
			break
	}

	if (method === "POST" && methodToSend !== "delete") {
		bodyToSend = JSON.stringify(bodyObject)
	} else {
		bodyToSend = null
	}

	const headers = {
		"Content-Type": "application/json"
	}

	try {
		const response = await fetch(`http://localhost:7070?method=${postFix}`, { method, body: bodyToSend, headers })
		const responseJson = await response.json()

		return responseJson
	} catch (error) {
		return error
	} finally {
		loader.remove()
	}
}
