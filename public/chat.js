const socket = io(); // Connect to the server

// Attempt to retrieve the username from local storage
const username = localStorage.getItem('username') || 'Anonymous';

const chatInput = document.getElementById('chat-input');
const sendButton = document.getElementById('send-btn');
const chatMessages = document.getElementById('chat-messages');
const urlParams = new URLSearchParams(window.location.search);
const roomName = urlParams.get('room'); // Extract the 'room' query parameter
const messageData = {msg: chatInput.value.trim(), room: roomName, username: username}
const typingIndicator = document.getElementById('typingIndicator');

document.getElementById('room-name').textContent = roomName || 'Chat Room';
socket.emit('join room', roomName);


let typingTimeout;

chatInput.addEventListener('keypress', () => {
    clearTimeout(typingTimeout);
    socket.emit('typing', { username: username, room: roomName });

    typingTimeout = setTimeout(() => {
        socket.emit('stop typing', { username: username, room: roomName });
    }, 500);
});


sendButton.addEventListener('click', function() {
    const message = chatInput.value.trim();
    if (message) {
        console.log(`Sending message: "${message}" as ${username} in ${roomName}`); // Debugging line
        socket.emit('chat message', { msg: message, room: roomName, username: username });
        chatInput.value = '';
    }
});

socket.on('chat message', function(data) {
    console.log(`Received message: "${data.msg}" from ${data.username}`); // Debugging line
    const messageElement = document.createElement('div');
    messageElement.innerText = `${data.username}: ${data.msg}`;
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

socket.on('chat history', function(messages) {
    // Clear existing messages first to avoid duplicates
    chatMessages.innerHTML = '';

    // Iterate through each message in the history and append it
    messages.forEach(function(message) {
        const messageElement = document.createElement('div');
        messageElement.innerText = `${message.username}: ${message.message}`; // Adjust according to how messages are structured
        chatMessages.appendChild(messageElement);
    });

    // Scroll to the latest message
    chatMessages.scrollTop = chatMessages.scrollHeight;

    socket.emit('join room', roomName);
});


socket.on('user typing', (username) => {
    typingIndicator.innerText = `${username} is typing...`;
    typingIndicator.style.display = 'block';
});

socket.on('user stop typing', (username) => {
    typingIndicator.innerText = '';
    typingIndicator.style.display = 'none';
});

