import { createContext, Context, useContext, useEffect, useState } from 'react';
import useConnectSockets from '../hooks/useConnectSockets';

const SocketContext: Context<any> = createContext<any>(null);
export const useSocket = () => useContext(SocketContext);

const SocketProvider = (props: any) => {
  const socket = useConnectSockets();
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    socket?.on('connected_users', (data: any) => {
      setOnlineUsers(data);
    });
  }, [socket]);
  return (
    <SocketContext.Provider
      value={{
        socket,
        onlineUsers,
      }}
    >
      {props.children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
