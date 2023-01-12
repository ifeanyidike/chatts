import { useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useRouter } from 'next/router';

let socketEndpoint: string = 'http://localhost:9100';

const ConnectSockets = () => {
  const socketRef = useRef<Socket | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const router = useRouter();
  const { query } = router;

  useEffect(() => {
    if (socketRef.current) return;

    socketRef.current = io(`${socketEndpoint}`, { autoConnect: false });
  }, []);

  useEffect(() => {
    if (!socketRef.current) return;
    setSocket(socketRef.current);
  }, [socketRef]);

  useEffect(() => {
    socket?.onAny(e => console.log(e));
  }, [socket]);

  // useEffect(() => {
  //   console.log({ socket });
  //   socket?.once('connect', () => {
  //     console.log(socket.id);
  //   });
  // }, [socket]);

  useEffect(() => {
    socket?.on('connect_error', err => {
      if (err.message === 'invalid user') {
        console.log('User is not valid');
        socket.off('connect_error');
      }
    });
  }, [socket]);

  return socket;
};

export default ConnectSockets;
