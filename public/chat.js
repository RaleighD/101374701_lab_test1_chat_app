const socket = io(); // Connect to the server

const chatInput = document.getElementById('chat-input');
const sendButton = document.getElementById('send-btn');
const chatMessages = document.getElementById('chat-messages');

const urlParams = new URLSearchParams(window.location.search);
const roomName = urlParams.get('room'); // Extract the 'room' query parameter

document.getElementById('room-name').textContent = roomName || 'Chat Room';

socket.emit('join room', roomName);

// Send a message when the send button is clicked
sendButton.addEventListener('click', function() {
    const message = chatInput.value.trim();
    if(message) {
        socket.emit('chat message', message); // Emit the message event to the server
        chatInput.value = ''; // Clear the input after sending
    }
});

// Listening for messages
socket.on('chat message', function(message) {
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
});
