import dotenv from 'dotenv';
dotenv.config({ path: '.env' });
import express from 'express';
import { Server, Socket } from 'socket.io';
import http from 'http';
import cors from 'cors';
import enhanceRouter from "./routes/enhance";

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
});

const PORT = process.env.PORT || 5003;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
    console.log('working');
    res.send('Running');
});

// Register the enhance router BEFORE socket.io handlers
app.use(enhanceRouter);

const rooms: { [roomId: string]: Set<string> } = {};
const socketToUser: { [socketId: string]: string } = {};
const roomMessages: {
    [roomId: string]: Array<{ sender: string; content: string; timestamp: number; role?: string }>
} = {};

const MAX_ROOM_CAPACITY = 2;

const getRoomStats = () => {
    return Object.entries(rooms).map(([roomId, participants]) =>
        `${roomId} (${participants.size}/${MAX_ROOM_CAPACITY})`
    ).join(', ') || 'No rooms';
};

io.on('connection', (socket: Socket) => {
    console.log(`New client connected: ${socket.id}`);
    console.log('Current rooms:', getRoomStats());

    socket.on('identify', (userId: string) => {
        socketToUser[socket.id] = userId;
        console.log(`User identified: socket ${socket.id} -> userId ${userId}`);
    });

    socket.on('requestRandomRoom', () => {
        for (const [roomId, participants] of Object.entries(rooms)) {
            if (participants.has(socket.id)) {
                participants.delete(socket.id);
                socket.leave(roomId);
                socket.broadcast.to(roomId).emit('system-message', `A user has left the room`);

                if (participants.size === 0) {
                    delete rooms[roomId];
                    console.log(`Deleted empty room: ${roomId} (keeping message history)`);
                }
            }
        }

        console.log(`User ${socket.id} requested to join a random room`);

        let availableRoomId: string | null = null;
        for (const [roomId, participants] of Object.entries(rooms)) {
            if (participants.size < MAX_ROOM_CAPACITY) {
                availableRoomId = roomId;
                break;
            }
        }

        if (!availableRoomId) {
            availableRoomId = `room_${Math.random().toString(36).substring(2, 10)}`;
            rooms[availableRoomId] = new Set();
            console.log(`Created new room: ${availableRoomId}`);
        }

        socket.join(availableRoomId);
        rooms[availableRoomId].add(socket.id);
        console.log(`User ${socket.id} joined room: ${availableRoomId} (${rooms[availableRoomId].size}/${MAX_ROOM_CAPACITY})`);

        console.log(`[requestRandomRoom] Sending room history for ${availableRoomId}:`, roomMessages[availableRoomId]?.length || 0, 'messages');
        socket.emit('room-history', roomMessages[availableRoomId] || []);

        socket.emit('randomRoomFound', availableRoomId);
        if (rooms[availableRoomId].size > 1) {
            socket.broadcast.to(availableRoomId).emit('system-message', `A user has joined the room`);
        }
    });

    socket.on('checkRoomAvailability', (room: string) => {
        console.log(`User ${socket.id} checking availability for room: ${room}`);

        const roomExists = rooms[room] && rooms[room].size > 0;
        const isFull = roomExists && rooms[room].size >= MAX_ROOM_CAPACITY;

        socket.emit('roomAvailabilityResponse', {
            roomId: room,
            exists: roomExists,
            isFull: isFull,
            currentUsers: roomExists ? rooms[room].size : 0,
            maxUsers: MAX_ROOM_CAPACITY
        });
    });

    socket.on('joinRoom', (room: string) => {
        console.log(`User ${socket.id} requested to join room: ${room}`);
        console.log(`Current user rooms before join:`, Object.entries(rooms).filter(([_, participants]) => participants.has(socket.id)).map(([roomId]) => roomId));

        if (rooms[room] && rooms[room].has(socket.id)) {
            console.log(`User ${socket.id} is already in room: ${room} - ignoring duplicate join`);
            return;
        }

        for (const [roomId, participants] of Object.entries(rooms)) {
            if (participants.has(socket.id)) {
                participants.delete(socket.id);
                socket.leave(roomId);
                socket.broadcast.to(roomId).emit('system-message', `A user has left the room`);

                if (participants.size === 0) {
                    delete rooms[roomId];
                    console.log(`Deleted empty room: ${roomId} (keeping message history)`);
                }
            }
        }

        if (!rooms[room]) {
            rooms[room] = new Set();
            console.log(`Created new room: ${room}`);
        }

        if (rooms[room].size >= MAX_ROOM_CAPACITY) {
            socket.emit('system-message', `Room ${room} is full (${rooms[room].size}/${MAX_ROOM_CAPACITY})`);
            return;
        }

        socket.join(room);
        rooms[room].add(socket.id);
        console.log(`Client ${socket.id} joined room: ${room} (${rooms[room].size}/${MAX_ROOM_CAPACITY})`);

        console.log(`[joinRoom] Sending room history for ${room}:`, roomMessages[room]?.length || 0, 'messages');
        socket.emit('room-history', roomMessages[room] || []);

        socket.emit('system-message', `You joined room: ${room}`);

        if (rooms[room].size > 1) {
            socket.broadcast.to(room).emit('system-message', `A user has joined the room`);
        }
    });

    socket.on('sendMessage', (message: string, room: string) => {
        console.log(`[Server] Received sendMessage from ${socket.id} - Room: ${room}, Message: ${message}`);
        const senderId = socketToUser[socket.id] || socket.id;
        const messageData = {
            sender: senderId,
            content: message,
            timestamp: Date.now(),
            role: undefined
        };

        if (!roomMessages[room]) {
            roomMessages[room] = [];
        }
        roomMessages[room].push(messageData);
        if (roomMessages[room].length > 200) {
            roomMessages[room].splice(0, roomMessages[room].length - 200);
        }
        console.log(`Stored message in room ${room}. Total messages in history:`, roomMessages[room].length);
        io.to(room).emit('chat-message', messageData);
        console.log(`Message sent to room ${room}: ${message}`);
    });

    socket.on('disconnect', () => {
        console.log(`Client disconnected: ${socket.id}`);
        delete socketToUser[socket.id];

        for (const [roomId, participants] of Object.entries(rooms)) {
            if (participants.has(socket.id)) {
                participants.delete(socket.id);
                console.log(`Removed user ${socket.id} from room ${roomId}`);

                socket.broadcast.to(roomId).emit('system-message', `A user has left the room`);

                if (participants.size === 0) {
                    delete rooms[roomId];
                    console.log(`Deleted empty room: ${roomId} (keeping message history)`);
                }
            }
        }

        console.log(`Remaining rooms:`, Object.keys(rooms).map(roomId => `${roomId} (${rooms[roomId].size} users)`));
    });
});

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});