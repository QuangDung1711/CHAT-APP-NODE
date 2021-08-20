const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const socket = io();
const urlSearchParams = new URLSearchParams(window.location.search);
const params = Object.fromEntries(urlSearchParams.entries());
const roomName  = document.getElementById('room-name');
const userList  = document.getElementById('users');

//get username and room from URL
const { username, room } = params;

//Join chat room
socket.emit('joinRoom', { username, room });

//get room and users
socket.on('roomUsers', ({room, users}) => {
    outputRoomName(room);
    outputUsers(users);
})

//Message from server
socket.on('message', message => {
    console.log(message);
    document.getElementById('account').innerHTML = username;
    outputMessage(message);

    //scroll down
    chatMessages.scrollTop = chatMessages.scrollHeight;
})

//Message submit 
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const msg = e.target.elements.msg.value;
    
    socket.emit('chatMessage', msg);
    document.getElementById('msg').value = '';
    document.getElementById('msg').focus();


})

//Output message to DOM
function outputMessage(message) {
    const div = document.createElement('div');
    if(message.username === username) {
        div.classList.add('messageMe');
    } else {
        div.classList.add('messageOther');
    }
    div.innerHTML = `
    <p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
        ${message.text}    
    </p>
    `;
    document.querySelector('.chat-messages').appendChild(div);
}

function outputRoomName(room) {
    roomName.innerText = room;
}

function outputUsers(users) {
    userList.innerHTML = `
        ${users.map(user => `<li>${user.username}</li>`).join('')}
    `
}