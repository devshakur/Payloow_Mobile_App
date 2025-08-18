// utils.ts
import { io, Socket } from "socket.io-client";

let socket: Socket;

export const initializeSocket = (userId: string) => {
  socket = io("wss://api.payloow.com"); // Replace with your server
  socket.emit("registerUser", userId);
};

export const getSocket = (): Socket => {
  return socket;
};
