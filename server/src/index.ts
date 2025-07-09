import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: '*', // Allowing all origins
        methods: ['GET', 'POST'],
    },
});

app.use(cors());
app.use(express.json());


const PORT = process.env.PORT || 4000;


interface Message {
    id: string;
    user: string;
    content: string;
    timestamp: string;
    isCurentUser: boolean;
    side: 'pro' | 'con';
}

io.on('connection', (socket) => {
    console.log(' Client is connected: ', socket.id);

    socket.on('debate:join', ({ user, debateId }: { user: string; debateId: string }) => {
        socket.join(debateId);
        console.log(`${user} joined room ${debateId}`);
    });

    socket.on('chat:message', ({ debateId, message }: { debateId: string; message: Message }) => {
        console.log(`Message received in room ${debateId}:`, message);
        socket.to(debateId).emit('chat:message', message);
    });

    socket.on('debate:leave', ({ user, debateId }: { user: string; debateId: string }) => {
        socket.leave(debateId);
        console.log(`${user} left room ${debateId}`);
    });

    socket.on('disconnect', () => {
        console.log(`Client disconnected: ${socket.id}`);
    });
});

server.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});
