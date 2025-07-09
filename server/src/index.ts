import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: '*',
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
    isCurrentUser: boolean;
    side: 'pro' | 'con';
}

// Simple storage for participants and messages
const participants = new Map<string, { socketId: string; user: string; side: 'pro' | 'con' }>();
const messages: Message[] = [];

io.on('connection', (socket) => {
    console.log('Client is connected: ', socket.id);

    socket.on('debate:join', ({ user, debateId }: { user: string; debateId: string }) => {
        console.log(`${user} attempting to join debate`);

        // Remove user from participants if they're already connected
        if (participants.has(socket.id)) {
            participants.delete(socket.id);
            console.log(`Removed ${user} from existing connection`);
        }

        // Assign side based on current participants count
        let assignedSide: 'pro' | 'con' | undefined;
        const existingParticipants = Array.from(participants.values());

        if (existingParticipants.length === 0) {
            // First participant gets 'pro'
            assignedSide = 'pro';
        } else if (existingParticipants.length === 1) {
            // Second participant gets the opposite side
            assignedSide = existingParticipants[0].side === 'pro' ? 'con' : 'pro';
        } else {
            // More than two participants not allowed
            socket.emit('debate:join-error', { message: 'Debate room is full.' });
            return;
        }

        // Add participant
        participants.set(socket.id, {
            socketId: socket.id,
            user,
            side: assignedSide as 'pro' | 'con'
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
            console.log(`  ${socketId}: ${participant.user} (${participant.side})`);  // vbs-3AFEcVPoI8mLAAAL: You (con)
        }
    });

    socket.on('chat:message', ({ debateId, message }: { debateId: string; message: Message }) => {
        console.log(`Message received:`, message);

        // Store message
        messages.push(message);

        // Broadcast to all other clients
        socket.broadcast.emit('chat:message', message);
    });

    socket.on('debate:get-participants', ({ debateId }: { debateId: string }) => {
        socket.emit('debate:participants-update', {
            participants: Array.from(participants.values()).map(p => ({
                user: p.user,
                side: p.side,
                socketId: p.socketId
            }))
        });
    });

    socket.on('debate:leave', ({ user, debateId }: { user: string; debateId: string }) => {
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

            console.log(`${participant?.user} disconnected`);
        }
    });
});

server.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});
