const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const User = require('./models/user');
const Message = require('./models/message');


const PORT = process.env.PORT || 3000;

// Mongo setup
mongoose.connect('mongodb+srv://admin:admin@cluster0.ocx31n5.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.error(err));

app.use(express.static('public'));
app.use(express.json());

// Signup Route
app.post('/signup', async (req, res) => {
    try {
        const { username, firstname, lastname, password } = req.body;
        const user = new User({ username, firstname, lastname, password });
        await user.save();
        return res.status(201).json({ message: 'User created successfully' });
    } catch (error) {

        return res.status(400).json({ error: error.message });
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

        if (password !== user.password) {
            return res.status(401).json({ message: 'Incorrect password' });
        }

        console.log('User found');

        return res.status(200).json({ user: username, message: 'Login successful', });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

// Chatroom select routing
app.get('/chat', (req, res) => {
    res.sendFile(__dirname + '/public/chat.html');
});

//Chat Routing and logic
io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('join room', async (joinedRoom) => {
        const room = joinedRoom;
        socket.join(room);
        console.log(`User joined room: ${room}`);

        try {

            const messages = await Message.find({ room: room })
                .sort({ createdAt: 1 })
                .limit(50)
                .exec();

            socket.emit('chat history', messages);
        } catch (err) {
            console.error('Error retrieving messages from database', err);
        }
    });

    socket.on('typing', (data) => {
        socket.to(data.room).emit('user typing', data.username);
    });

    socket.on('stop typing', (data) => {
        socket.to(data.room).emit('user stop typing', data.username);
    });


    // SAVINg messages to mongo
    socket.on('chat message', async (data) => {
        const message = new Message({
            room: data.room,
            username: data.username,
            message: data.msg
        });

        try {
            // Save the message to MongoDB using async/await
            await message.save();
            // After saving, broadcast the message to the room
            io.to(data.room).emit('chat message', data);
        } catch (err) {
            console.error('Error saving message to database', err);
        }
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});



// Additional message saving stuff

io.on('chat message', (data) => {
    const message = new Message({
        room: data.room,
        username: data.username,
        message: data.msg
    });

    // Save the message to MongoDB
    message.save(err => {
        if (err) {
            console.error('Error saving message to database', err);
            return;
        }

        // After saving, broadcast to room
        io.to(data.room).emit('chat message', data);
    });
});

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
