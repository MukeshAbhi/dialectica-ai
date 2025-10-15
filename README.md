<p align="center">
    <img src="./dialecticabanner.png" alt="Dialectica Debate Room Banner" />
</p>

<div align="center">

[![GitHub Stars](https://img.shields.io/github/stars/Condition00/debateroom-ai?style=social)](https://github.com/Condition00/debateroom-ai/stargazers)
[![GitHub Forks](https://img.shields.io/github/forks/Condition00/debateroom-ai?style=social)](https://github.com/Condition00/debateroom-ai/network/members)
[![Discord](https://img.shields.io/badge/Discord-Join%20Server-5865F2?logo=discord&logoColor=white)](https://discord.gg/sYGyBHu5SU)
[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

</div>

## Features

- **Real-time Communication**: Instant messaging powered by Socket.io
- **Room-based Debates**: Create or join specific debate rooms
- **Random Room Matching**: Get paired with available participants
- **Modern UI**: Clean, responsive interface with dark/light mode support
- **Room Management**: Smart room capacity handling (max 2 participants per room)
- **Real-time Status**: Live connection status indicators

## Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Socket.io Client** - Real-time communication
- **Next-Auth** - Authentication (configured)
- **Framer Motion** - Smooth animations

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Socket.io** - WebSocket implementation
- **Prisma** - Database ORM
- **PostgreSQL** - Database
- **TypeScript** - Type-safe server development

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database
- npm/yarn/pnpm

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Dialectica-ai/dialectica-ai
   cd dialectica-ai
   ```

2. **Install dependencies**
   ```bash
   # Install server dependencies
   cd server
   npm install

   # Install client dependencies
   cd ../client
   npm install
   ```

3. **Database Setup**
   ```bash
   cd server
   # Set up your DATABASE_URL in .env file
   echo "DATABASE_URL=postgresql://username:password@localhost:5432/dialectica_ai" > .env

   # Run database migrations
   npx prisma migrate dev
   ```

4. **Start the development servers**

   **Terminal 1 - Backend:**
   ```bash
   cd server
   npm run dev
   ```

   **Terminal 2 - Frontend:**
   ```bash
   cd client
   npm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:3001
   - Backend: http://localhost:5003

## Project Structure

```
dialectica-ai/
├── client/                 # Next.js frontend application
│   ├── src/
│   │   ├── app/           # App Router pages
│   │   ├── components/    # Reusable UI components
│   │   ├── hooks/         # Custom React hooks
│   │   └── lib/           # Utility functions and configurations
│   └── types/             # TypeScript type definitions
├── server/                # Express.js backend application
│   ├── src/
│   │   ├── routers/       # API route handlers
│   │   ├── services/      # Business logic
│   │   ├── sockets/       # Socket.io event handlers
│   │   └── index.ts       # Server entry point
│   └── prisma/            # Database schema and migrations
└── docs/                  # Documentation
```

## Usage

1. **Create or Join a Room**: Enter a room name on the homepage
2. **Random Matching**: Click "Join Random Available Room" to be paired automatically
3. **Start Debating**: Send messages in real-time with other participants
4. **Room Management**: Rooms automatically handle capacity and cleanup

## Environment Variables

### Server (.env)
```env
DATABASE_URL=postgresql://username:password@localhost:5432/dialectica_ai
PORT=5003
```

### Client (.env)
```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here
CLERK_SECRET_KEY=your_clerk_secret_key_here

# Custom Clerk Routes
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/auth/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/auth/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5003
NEXT_PUBLIC_SOCKET_URL=http://localhost:5003
```

**Note for Production**: Update `NEXT_PUBLIC_API_URL` and `NEXT_PUBLIC_SOCKET_URL` to your deployed server URL for mobile device compatibility.

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

**⏰ Pull Request Review Schedule**: All pull requests will be reviewed and merged daily at 6:30 PM EST.

### Development Guidelines

1. **Code Style**: We use TypeScript and ESLint for code quality
2. **Commits**: Follow conventional commit format
3. **Pull Requests**: Provide clear descriptions and test coverage
4. **Issues**: Use provided templates for bug reports and feature requests

## API Documentation

### Socket Events

#### Client → Server
- `requestRandomRoom` - Request to join any available room
- `joinRoom(roomId)` - Join a specific room
- `sendMessage(message, roomId)` - Send a message to a room
- `checkRoomAvailability(roomId)` - Check if room exists and has space

#### Server → Client
- `chat-message` - Receive chat messages
- `system-message` - Receive system notifications
- `randomRoomFound(roomId)` - Notification of successful random room match
- `roomAvailabilityResponse` - Response to room availability check

## Database Schema

The application uses Prisma ORM with the following main models:

- **User**: User accounts and profiles
- **Room**: Debate room information
- **Message**: Chat messages with relationships

## Roadmap

- [ ] AI-powered debate moderation
- [ ] User authentication and profiles
- [ ] Debate scoring and analytics
- [ ] Mobile app development
- [ ] Video/voice chat integration
- [ ] Tournament-style debates

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support
- 👾 Discord: [Discord](https://discord.com/invite/sYGyBHu5SU)
- 🐛 Issues: [GitHub Issues](https://github.com/Dialectica-ai/dialectica-ai/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/Dialectica-ai/dialectica-ai/discussions)

## Acknowledgments

- Socket.io team for real-time communication
- Next.js team for the excellent React framework
- Prisma team for the database toolkit
- All contributors and users of this project

---

⭐ Star this repository if you find it useful!
