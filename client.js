//this is the frontend javascipt file of the JustChat application. 
//It will help in listening to the events generated by the backend javascript file.

// const socket = io('http://localhost:8000',{transports:['websocket']});       //for running in local computer.
//the nodejs backend of this website is deployed on Heroku.
const socket = io('https://justchat-backend.onrender.com',{transports:['websocket']});   //connecting backend with frontend
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
    socket.emit('send',message);    //this will call the send function present in the backend and it will broadcast the message to every connected user.
    messageInput.value = '';       
    updateScroll();
})


//the website will start from here.
var nameOfNewJoiner = window.prompt("Enter your name to join");       
if(nameOfNewJoiner.length==0){
    nameOfNewJoiner = "User";   //will keep the name as "user" if name is not entered.
}

welcoming(nameOfNewJoiner);
updateScroll();
socket.emit('new-user-joined', nameOfNewJoiner);    //add the name of the user along with a unique id to the "users" object present in the backend

//call the user-joined method present in the backend. It will broadcast to every user that a new user has joined the chat.
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
