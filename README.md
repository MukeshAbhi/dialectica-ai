<p align="center">
    <img src="./dialecticabanner.png" alt="Dialectica Debate Room Banner" />
</p>

<div align="center">

[![GitHub Stars](https://img.shields.io/github/stars/Condition00/debateroom-ai?style=social)](https://github.com/Condition00/debateroom-ai/stargazers)
[![GitHub Forks](https://img.shields.io/github/forks/Condition00/debateroom-ai?style=social)](https://github.com/Condition00/debateroom-ai/network/members)
[![Discord](https://img.shields.io/badge/Discord-Join%20Server-5865F2?logo=discord&logoColor=white)](https://discord.gg/sYGyBHu5SU)
[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

</div>

Where ideas collide in real time — **Dialectica AI** lets you debate, match, and connect instantly.

## Features

- **Real-time Communication**: Talk in real-time using fast messaging powered by Socket.io
- **Room-based Debates**: Pick a debate room or make your own
- **Random Room Matching**: Get paired with someone randomly if no room is chosen
- **Modern UI**: Clean, responsive interface with dark/light mode support
- **Room Management**:Each room allows only 2 people for focused debates
- **Real-time Status**: See who's online and connect instantly
## Tech Stack

### Frontend - what you see and interact with
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Socket.io Client** - Real-time communication
- **Next-Auth** - Authentication (configured)
- **Framer Motion** - Smooth animations

### Backend - what runs behind the screen
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Socket.io** - WebSocket implementation
- **Prisma** - Database ORM
- **PostgreSQL** - Database
- **TypeScript** - Type-safe server development

## Ready to go? Here's how

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

**Option 1: Run with Docker**

1. **Build and run the Docker containers**
   ```bash
   docker-compose up --build
   ```
2. **Access the application**
   - Frontend: http://localhost:3001
   - Backend: http://localhost:5003

**Option 2: Run both servers manually**

1. **Install dependencies**
   ```bash
   # Install server dependencies
   cd server
   npm install

   # Install client dependencies
   cd ../client
   npm install
   ```

2. **Database Setup**
   ```bash
   cd server
   # Set up your DATABASE_URL in .env file
   echo "DATABASE_URL=postgresql://username:password@localhost:5432/dialectica_ai" > .env

   # Run database migrations
   npx prisma migrate dev

   # Generate Prisma client
   npx prisma generate
   ```

3. **Start the development servers**

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

4. **Access the application**
   - Frontend: http://localhost:3001
   - Backend: http://localhost:5003

## Project Structure

```
dialectica-ai/
├── client/                 # Frontend (Next.js)
│   ├── src/
│   │   ├── app/           # App Router pages
│   │   ├── components/    # UI building blocks 
│   │   ├── hooks/         # Custom React logic
│   │   └── lib/           # Utility functions and configurations
│   │   └── generated/     # Prisma generated client
│   └── prisma/            # Prisma schema and migrations
│   
├── server/                # Express.js backend application
│   ├── src/
│       ├── routers/       # API route handlers
│       ├── services/      # Business logic
│       ├── sockets/       # Socket.io event handlers
│       └── index.ts       # Server entry point
|── docker-compose.yml     # Docker configuration
└── README.md              # Project documentation

```

## Usage

1. **Create or Join a Room**: Type a room name on the homepage to start or enter an existing debate 
2. **Get Matched Automatically**: Click "Join Random Available Room" to be paired instantly
3. **Start Debating**: Send messages in real-time with other participants
4. **Room Management**: Each room allows only 2 people and cleans up automatically when empty

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

We welcome contributions!
Please see our [Contributing Guide](CONTRIBUTING.md) for details.

**🔀 Branch Strategy**: All contributions should be made to the `main` branch. Please ensure your pull requests target `main`.

**⏰ Pull Request Review Schedule**: All pull requests will be reviewed and merged daily at 6:30 PM EST.

### Development Guidelines

1. **Branching**: Create feature branches from `develop` and submit PRs to `develop`
2. **Code Style**: We use TypeScript and ESLint for code quality
3. **Commits**: Follow conventional commit format
4. **Pull Requests**: Provide clear descriptions and test coverage
5. **Issues**: Use provided templates for bug reports and feature requests

## API Documentation

### Socket Events

#### Client → Server
- `requestRandomRoom` - Ask the server to find any available room 
- `joinRoom(roomId)` - Enter a specific room by its ID
- `sendMessage(message, roomId)` - Send a chat message to a room
- `checkRoomAvailability(roomId)` - Check if room exists and has space

#### Server → Client
- `chat-message` - A new message from your debate partner
- `system-message` - Receive system notifications
- `randomRoomFound(roomId)` - Notification of successful random room match
- `roomAvailabilityResponse` - Tells you if a room is available or full

### Why It Matters
These events make real-time chat and room matching possible. If you're contributing to the frontend or backend, understanding these will help you:
- Build new features like debate scoring or moderation
- Fix bugs related to room joining or message delivery
- Test socket connections during development

## Database Schema

The application uses Prisma ORM with the following main models:

- **User**: - Stores account info like name, email, and profile details
            - Linked to the rooms they join and messages they send

- **Room**: - Each room is a space for two users to debate
            - Tracks room name, status (active/inactive), and participants

- **Message**: - Stores every chat message sent in a room
               - Linked to both the user who sent it and the room it belongs to
               - Includes timestamps for when messages were sent
### How They Connect ?
- A User can join many Rooms
- A Room can have up to 2 Users
- A Message belongs to one User and one Room

## Roadmap (What's Done & What's Coming)

 ### Already Built
- Real-time Chat
- Room Matching
- Smart Room Limits
- User Login

### In Progress/ Planned
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

This project wouldn’t be possible without the amazing tools and contributors who make open source great:
- Socket.io team for real-time communication
- Next.js team for the excellent React framework
- Prisma team for the database toolkit
- All contributors and users of this project

---

⭐ Star this repository if you find it useful!


