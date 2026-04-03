import { io } from "socket.io-client";

const socket = io("https://wanderlust-1-s261.onrender.com", {
  withCredentials: true,
});

export default socket;