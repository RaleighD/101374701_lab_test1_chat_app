const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const User = require('./models/user');

const PORT = process.env.PORT || 3000;

// Mongo setup
mongoose.connect('mongodb+srv://admin:admin@cluster0.ocx31n5.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.error(err));

app.use(express.static('public'));
app.use(express.json()); // For parsing application/json

// Signup Route
app.post('/signup', async (req, res) => {
    try {
        const { username, firstname, lastname, password } = req.body;
        const user = new User({ username, firstname, lastname, password });
        await user.save();
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        // Updated to return JSON
        res.status(400).json({ error: error.message });
    }
});

app.get('/signup', (req, res) => {
    res.sendFile(__dirname + '/public/signup.html');
});

// Login Route
app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) {
            console.log('User not found');
            return res.status(400).json({ error: 'User not found' });
        }
        console.log('User found');
        // Assuming password check is omitted, update for JSON response
        res.status(200).json({ message: 'Login successful' });
    } catch (error) {
        // Updated to return JSON
        res.status(500).json({ error: error.message });
    }
});

//Chat Routing
io.on('connection', (socket) => {
    console.log('A user connected');


    //Joining room,
    socket.on('join room', (room) => {
        socket.join(room);
        console.log(`User joined room: ${room}`);
    });
    //Sending messages only to users in specific room
    socket.on('chat message', (msg, room) => {
        io.to(room).emit('chat message', msg);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
