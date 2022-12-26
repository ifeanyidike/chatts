import { useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

let socketEndpoint: string = 'http://localhost:9100';

const ConnectSockets = () => {
  const socketRef = useRef<Socket | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    if (socketRef.current) return;
    socketRef.current = io(socketEndpoint);
  }, []);

  useEffect(() => {
    if (!socketRef.current) return;
    setSocket(socketRef.current);
  }, [socketRef]);

  useEffect(() => {
    socket?.on('connect', () => {
      console.log(socket.id);
    });
  }, [socket]);

  return socket;
};

export default ConnectSockets;
