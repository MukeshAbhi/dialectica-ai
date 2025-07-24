import express from 'express';
import { Server, Socket } from 'socket.io';
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

const rooms: { [roomId: string]: Set<string> } = {};

const MAX_ROOM_CAPACITY = 2;

// statistics:
const getRoomStats = () => {
    return Object.entries(rooms).map(([roomId, participants]) =>
        `${roomId} (${participants.size}/${MAX_ROOM_CAPACITY})`
    ).join(', ') || 'No rooms';
};

io.on('connection', (socket: Socket) => {
    console.log(`New client connected: ${socket.id}`);
    console.log('Current rooms:', getRoomStats());

    socket.on('requestRandomRoom', () => {
        // Remove user from any existing rooms first
        for (const [roomId, participants] of Object.entries(rooms)) {
            if (participants.has(socket.id)) {
                participants.delete(socket.id);
                socket.leave(roomId);
                socket.broadcast.to(roomId).emit('system-message', `User ${socket.id} has left the room`);

                // Clean up empty rooms
                if (participants.size === 0) {
                    delete rooms[roomId];
                    console.log(`Deleted empty room: ${roomId}`);
                }
            }
        }

        console.log(`User ${socket.id} requested to join a random room`);

        // Find available room with less than MAX_ROOM_CAPACITY users
        let availableRoomId: string | null = null;
        for (const [roomId, participants] of Object.entries(rooms)) {
            if (participants.size < MAX_ROOM_CAPACITY) {
                availableRoomId = roomId;
                break;
            }
        }

        // If no available room, create a new one
        if (!availableRoomId) {
            availableRoomId = `room_${Math.random().toString(36).substring(2, 10)}`;
            rooms[availableRoomId] = new Set();
            console.log(`Created new room: ${availableRoomId}`);
        }

        // Join socket to that room
        socket.join(availableRoomId);
        rooms[availableRoomId].add(socket.id);
        console.log(`User ${socket.id} joined room: ${availableRoomId} (${rooms[availableRoomId].size}/${MAX_ROOM_CAPACITY})`);

        socket.emit('randomRoomFound', availableRoomId);

        socket.broadcast.to(availableRoomId).emit('system-message', `User ${socket.id} has joined the room`);
    });

    socket.on('joinRoom', (room: string) => {
        // Remove user from any existing rooms first /// important for room management ///// AAAAAAAAA
        for (const [roomId, participants] of Object.entries(rooms)) {
            if (participants.has(socket.id)) {
                participants.delete(socket.id);
                socket.leave(roomId);
                socket.broadcast.to(roomId).emit('system-message', `User ${socket.id} has left the room`);

                if (participants.size === 0) {
                    delete rooms[roomId];
                    console.log(`Deleted empty room: ${roomId}`);
                }
            }
        }

        // Initialize room if it doesn't exist
        if (!rooms[room]) {
            rooms[room] = new Set();
            console.log(`Created new room: ${room}`);
        }

        // Check room capacity
        if (rooms[room].size >= MAX_ROOM_CAPACITY) {
            socket.emit('system-message', `Room ${room} is full (${rooms[room].size}/${MAX_ROOM_CAPACITY})`);
            return;
        }

        // Join the room
        socket.join(room);
        rooms[room].add(socket.id);
        console.log(`Client ${socket.id} joined room: ${room} (${rooms[room].size}/${MAX_ROOM_CAPACITY})`);

        socket.emit('system-message', `You joined room: ${room}`);
        socket.broadcast.to(room).emit('system-message', `User ${socket.id} has joined the room`);
    });

    socket.on('sendMessage', (message: string, room: string) => {
        io.to(room).emit('chat-message', message);
        console.log(`Message sent to room ${room}: ${message}`);
    });

    socket.on('disconnect', () => {
        console.log(`Client disconnected: ${socket.id}`);

        // Remove user from all rooms they were in
        for (const [roomId, participants] of Object.entries(rooms)) {
            if (participants.has(socket.id)) {
                participants.delete(socket.id);
                console.log(`Removed user ${socket.id} from room ${roomId}`);

                // Notify remaining users in the room
                socket.broadcast.to(roomId).emit('system-message', `User ${socket.id} has left the room`);

                // Clean up empty rooms
                if (participants.size === 0) {
                    delete rooms[roomId];
                    console.log(`Deleted empty room: ${roomId}`);
                }
            }
        }

        console.log(`Remaining rooms:`, Object.keys(rooms).map(roomId => `${roomId} (${rooms[roomId].size} users)`));
    });
});

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
