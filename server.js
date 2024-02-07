const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 3000;

const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://admin:admin@cluster0.ocx31n5.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.error(err));

app.use(express.static('public'));


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});


io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });


});

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log('I am console. Beep Boop.');
});