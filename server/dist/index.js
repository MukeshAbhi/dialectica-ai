import express from 'express';
import { Server } from 'socket.io';
import http from 'http';
import cors from 'cors';
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
});
const PORT = process.env.PORT || 5003;
app.use(cors());
app.use(express.json());
app.get('/', (req, res) => {
    console.log('working');
    res.send('Running');
});
io.on('connection', (socket) => {
    console.log('New client connected');
    socket.on('joinRoom', (room) => {
        socket.join(room);
        console.log(`Client joined room: ${room}`);
        socket.emit('message', `You joined room: ${room}`);
    });
    socket.on('sendMessage', (message, room) => {
        io.to(room).emit('message', message);
        console.log(`Message sent to room ${room}: ${message}`);
    });
    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
