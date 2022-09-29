// const socket = io('http://localhost:8000',{transports:['websocket']});
const socket = io('https://boiling-sea-62901.herokuapp.com/',{transports:['websocket']});
const form = document.getElementById('send-message');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector(".container");
const navBar = document.querySelector('.topNavBar');
const audio = new Audio('./chatTone.mp3');

const appending = (message,statusOfMessage) => {
    const messageElement = document.createElement('div');
    messageElement.innerHTML = message;
    messageElement.classList.add('message'); //this message is the message class we have defined in the CSS file, this is not the message that we will be getting from the user.
    messageElement.classList.add(statusOfMessage);
    messageContainer.append(messageElement);
    if(statusOfMessage == "received"){
        audio.play();
    }

}
//for showing welcome message and name of the person who has joined
const welcoming = (nameOfNewJoiner) =>{
    const welcomeElement = document.createElement('h3');
    welcomeElement.innerHTML = `Hey ${nameOfNewJoiner}, Welcome to JustChat \u{1F609}`;
    welcomeElement.classList.add('h3');
    navBar.append(welcomeElement);

}

//this will keep the chat container scrolled to the bottom
function updateScroll(){
    messageContainer.scrollTop = messageContainer.scrollHeight;
}

//for sending the messages of the logged-in user
form.addEventListener('submit',(e)=>{
    e.preventDefault(); //this will not refresh the page
    const message = messageInput.value;
    appending(`<b>You :</b> ${message}`,"sent");
    socket.emit('send',message);
    messageInput.value = '';       
    updateScroll();
})
var nameOfNewJoiner = window.prompt("Enter your name to join","User");       
if(nameOfNewJoiner.length==0){
    nameOfNewJoiner = "User";   //will keep the name as "user" if name is not entered.
}

welcoming(nameOfNewJoiner);
updateScroll();
socket.emit('new-user-joined', nameOfNewJoiner);

socket.on('user-joined',nameOfNewJoiner=>{
    appending(`<b>${nameOfNewJoiner}</b> joined the chat \u{1F929}`,"joined");
    updateScroll();
})

//for the messages received from other user
socket.on('receive',data=>{
    appending(`<b>${data.nameOfSender} :</b> ${data.message}`,"received");
    updateScroll();
})

//for those who left the chat
socket.on('leftTheChat',nameThatLeft=>{
    appending(`<b>${nameThatLeft}</b> left the chat \u{1F614}`,"leaved");
    updateScroll();
})
