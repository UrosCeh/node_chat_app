const chatForm = document.getElementById("chat-form")
const chatMessages = document.getElementById("chat-messages")
const roomName = document.getElementById("room-name")
const usersList = document.getElementById("users")

const params = () => {
	let search = window.location.href.split("username=")
	let param = search[1].split("&room=")
	return {
		username: param[0],
		room: param[1]
	}
}
const username = params().username
const room = params().room

const socket = io()

socket.emit("joinRoom", { username, room })

socket.on("roomUsers", ({ room, users }) => {
	outputRoomName(room)
	outputUsers(users)
})

socket.on("message", (message) => {
	outputMessage(message)
})

chatForm.addEventListener("submit", (e) => {
	e.preventDefault()

	const msg = e.target.elements.msg.value
	socket.emit("chat_message", msg)

	e.target.elements.msg.value = ""
	e.target.elements.msg.focus()
})

function outputMessage(message) {
	// <div class="message">
	// 	<p class="meta">
	// 		Mary <span>9:15pm</span>
	// 	</p>
	// 	<p class="text">Lorem ipsum dolor sit amet consectetur adipisicing elit. Eligendi, repudiandae.</p>
	// </div>
	const div = document.createElement("div")
	div.classList.add("message")
	const pMeta = document.createElement("p")
	pMeta.classList.add("meta")
	pMeta.innerText = `${message.username} : `

	const span = document.createElement("span")
	span.innerText = message.time
	pMeta.appendChild(span)

	const pText = document.createElement("p")
	pText.classList.add("text")
	pText.innerText = message.text

	div.appendChild(pMeta)
	div.appendChild(pText)

	chatMessages.appendChild(div)

	chatMessages.scrollTop = chatMessages.scrollHeight
}

function outputRoomName(room) {
	roomName.innerText = room
}

function outputUsers(users) {
	usersList.innerHTML = ""
	users.forEach((user) => {
		const li = document.createElement("li")
		li.innerText = user.username
		usersList.appendChild(li)
	})
}
