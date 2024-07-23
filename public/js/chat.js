import * as Popper from 'https://cdn.jsdelivr.net/npm/@popperjs/core@^2/dist/esm/index.js'
//CLIENT_SEND_MESSAGE
const formSendData = document.querySelector(".chat .inner-form")
if (formSendData) {
    formSendData.addEventListener("submit", (e) => {
        e.preventDefault()
        const content = e.target.elements.content.value;
        if (content) {
            socket.emit("CLIENT_SEND_MESSAGE", content)
            e.target.elements.content.value = ""
        }
    })
}
//End CLIENT_SEND_MESSAGE

//SERVER_RETURN_MESSAGE
socket.on("SERVER_RETURN_MESSAGE", (data) => {
    const myId = document.querySelector("[my-id]").getAttribute("my-id")
    const body = document.querySelector(".chat .inner-body")

    const div = document.createElement("div")
    let htmlFullName = ""

    if(myId == data.userId){
        div.classList.add("inner-outgoing")
    } else {
        htmlFullName = `<div class="inner-name">${data.fullName}</div>`
        div.classList.add("inner-incoming")
    }
    div.innerHTML=`
        ${htmlFullName}
        <div class="inner-content">${data.content}</div>
    `
    body.appendChild(div)
    body.scrollTop = body.scrollHeight
})
//End SERVER_RETURN_MESSAGE

//Scroll Chat To Bottom
const bodyChat = document.querySelector(".chat .inner-body")
if (bodyChat) {
    bodyChat.scrollTop = bodyChat.scrollHeight
}
// end Scroll Chat To Bottom

//Show Icon Chat
//show Popup
const buttonIcon = document.querySelector(".button-icon")
if(buttonIcon){
    const tooltip = document.querySelector('.tooltip')
    Popper.createPopper(buttonIcon, tooltip)

    buttonIcon.onclick = () => {
        tooltip.classList.toggle('shown')
    }
}
//end show popup
//Inser Icon to Input
const emojiPicker = document.querySelector("emoji-picker")
if(emojiPicker) {
    const inputChat = document.querySelector(".chat .inner-form input[name='content']")
    emojiPicker.addEventListener("emoji-click", (event) =>{
        const icon = event.detail.unicode;
        inputChat.value = inputChat.value + icon
    })

    // input Keyup
    inputChat.addEventListener("keyup", ()=> {
        socket.emit("CLIENT_SEND_TYPING", "show")
    })
    // End input Keyup
}
// End Inser Icon to Input
//End Show Icon Chat

// CLIENT_SEND_TYPING
socket.on("CLIENT_SEND_TYPING", (data)=> {
    console.log(data)
})
//End  CLIENT_SEND_TYPING