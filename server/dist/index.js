"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: '*', // Allowing all origins
        methods: ['GET', 'POST'],
    },
});
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const PORT = process.env.PORT || 4000;
// Simple storage for participants and messages
const participants = new Map();
const messages = [];
io.on('connection', (socket) => {
    console.log('Client is connected: ', socket.id);
    socket.on('debate:join', ({ user, debateId }) => {
        console.log(`${user} attempting to join debate`);
        // Remove user from participants if they're already connected
        if (participants.has(socket.id)) {
            participants.delete(socket.id);
            console.log(`Removed ${user} from existing connection`);
        }
        // Assign side based on current participants count
        let assignedSide;
        const existingParticipants = Array.from(participants.values());
        if (existingParticipants.length === 0) {
            // First participant gets 'pro'
            assignedSide = 'pro';
        }
        else if (existingParticipants.length === 1) {
            // Second participant gets the opposite side
            assignedSide = existingParticipants[0].side === 'pro' ? 'con' : 'pro';
        }
        else {
            // If more than 2 participants, alternate sides
            const proCount = existingParticipants.filter(p => p.side === 'pro').length;
            const conCount = existingParticipants.filter(p => p.side === 'con').length;
            assignedSide = proCount <= conCount ? 'pro' : 'con';
        }
        // Add participant
        participants.set(socket.id, {
            socketId: socket.id,
            user,
            side: assignedSide
        });
        console.log(`${user} joined as ${assignedSide.toUpperCase()}. Total participants: ${participants.size}`);
        // Send room and side assignment to the client
        socket.emit('debate:room-assigned', {
            roomId: 'room1',
            side: assignedSide,
            userId: socket.id
        });
        // Notify all clients about participant updates
        io.emit('debate:participants-update', {
            participants: Array.from(participants.values()).map(p => ({
                user: p.user,
                side: p.side,
                socketId: p.socketId
            }))
        });
        // Debug: Log all current participants
        console.log('Current participants:');
        for (const [socketId, participant] of participants.entries()) {
            console.log(`  ${socketId}: ${participant.user} (${participant.side})`);
        }
    });
    socket.on('chat:message', ({ debateId, message }) => {
        console.log(`Message received:`, message);
        // Store message
        messages.push(message);
        // Broadcast to all other clients
        socket.broadcast.emit('chat:message', message);
    });
    socket.on('debate:get-participants', ({ debateId }) => {
        socket.emit('debate:participants-update', {
            participants: Array.from(participants.values()).map(p => ({
                user: p.user,
                side: p.side,
                socketId: p.socketId
            }))
        });
    });
    socket.on('debate:leave', ({ user, debateId }) => {
        // Remove participant
        if (participants.has(socket.id)) {
            participants.delete(socket.id);
            // Notify all clients about participant updates
            io.emit('debate:participants-update', {
                participants: Array.from(participants.values()).map(p => ({
                    user: p.user,
                    side: p.side,
                    socketId: p.socketId
                }))
            });
            console.log(`${user} left the debate`);
        }
    });
    socket.on('disconnect', () => {
        console.log(`Client disconnected: ${socket.id}`);
        // Remove from participants
        if (participants.has(socket.id)) {
            const participant = participants.get(socket.id);
            participants.delete(socket.id);
            // Notify all clients about participant updates
            io.emit('debate:participants-update', {
                participants: Array.from(participants.values()).map(p => ({
                    user: p.user,
                    side: p.side,
                    socketId: p.socketId
                }))
            });
            console.log(`${participant === null || participant === void 0 ? void 0 : participant.user} disconnected`);
        }
    });
});
server.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});
