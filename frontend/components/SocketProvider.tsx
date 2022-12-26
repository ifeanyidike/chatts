import { createContext, Context, useContext } from 'react';
import useConnectSockets from '../hooks/useConnectSockets';

const SocketContext: Context<any> = createContext<any>(null);
export const useSocket = () => useContext(SocketContext);

const SocketProvider = (props: any) => {
  const socket = useConnectSockets();
  return (
    <SocketContext.Provider
      value={{
        socket,
      }}
    >
      {props.children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
