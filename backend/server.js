import express from 'express';
import dotenv from 'dotenv'

import chats from './data/data.js'
import connectDB from './config/db.js';
import colors from 'colors';
import userRoute from './routes/userRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import { notFound, customErrorhandler } from './middlewares/errorHandlerMiddleware.js';
import messageRoutes from './routes/messageRoutes.js';

import { Server } from 'socket.io';


const app = express();
dotenv.config();
app.use(express.json())

// // All Routes
app.use('/api/user', userRoute)
app.use('/api/chat', chatRoutes)
app.use('/api/message', messageRoutes)

app.get('/', (req, res) => {
    res.send('App is Running ')
})

app.use(notFound);
app.use(customErrorhandler);

const port = process.env.PORT || 5200;

const server = app.listen(port, (err, res) => {
    if (err) {
        console.log('App is not listening on port ' + port + ': ' + err.message);
    } else {
        console.log(`App is listening on port ${port}`.yellow);
        connectDB();
    }
});

const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ["GET", "POST", "PUT", "DELETE"]
    }
});

io.on("connection", (socket) => {
    console.log("Connected To Socket.io");
    // $ Initial Setup User Join 
    socket.on("setup", async (userData) => {
        socket.join(userData._id);
        socket.emit("connected")
    })
    // $ User Join Chat With Room
    socket.on("joinChat", async (room) => {
        socket.join(room);
        console.log('User join room' + room);
    })

    // $ Typing Indicator
    socket.on('typing', async (room) => socket.in(room).emit("Typing"))

    socket.on('stopTyping', async (room) => socket.in(room).emit("stop Typing"))

    // $ User Join Chat With Room
    socket.on("newMessage", async (newMessageReceived) => {
        var chat = newMessageReceived.chat;

        if (!chat.users) return console.log("Chat.user not defined");

        chat.users.forEach(user => {
            if (user._id === newMessageReceived.sender._id) {
                return
            }
            socket.in(user._id).emit('messageReceived', newMessageReceived)
        });
    })

    socket.off("setup", async () => {
        console.log("User Disconnected");
        socket.leave(userData._id)
    })
})