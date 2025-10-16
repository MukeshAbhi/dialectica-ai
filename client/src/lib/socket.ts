// single socket connection.
import io from "socket.io-client";

let socket: SocketIOClient.Socket | null = null;

// Get socket URL from environment variable or default to localhost
const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5003";

export const getSocket = () => {
  if (!socket) {
    socket = io(SOCKET_URL);
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
