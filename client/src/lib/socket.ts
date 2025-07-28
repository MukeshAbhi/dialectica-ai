// single socket connection.
import io from "socket.io-client";

let socket: SocketIOClient.Socket | null = null;

export const getSocket = () => {
  if (!socket) {
    socket = io("http://localhost:5003");
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
