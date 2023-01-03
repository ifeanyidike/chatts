import React, { useEffect, useState } from 'react';
import { useSocket } from './SocketProvider';
import { IUser } from '../interfaces/channeltypes';
import { useSession } from 'next-auth/react';

interface Props {
  isTyping: undefined | boolean;
  isInIframe: undefined | boolean;
  currentUser?: IUser;
}

interface IUserTyping {
  name?: string;
  email?: string;
}
const MessageList = (props: Props) => {
  const { socket } = useSocket();
  const { isTyping, isInIframe } = props;
  const [userTyping, setUserTyping] = useState<IUserTyping>({});
  const { data: session } = useSession();

  const user = session?.user || {
    email: undefined,
    image: undefined,
    name: 'Guest',
  };

  useEffect(() => {
    if (isTyping === undefined || !socket) return;
    socket.emit('isTyping', { isTyping, user });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTyping, socket]);

  useEffect(() => {
    if (!socket) return;
    socket.on('message', (data: any) => console.log({ data }));
    socket.on('onUserTyping', (data: any) => {
      console.log({ data });
      if (data.isTyping) {
        const { name, email } = data.user || {};
        setUserTyping({ name, email });
      } else {
        setUserTyping({});
      }
    });
  }, [socket]);

  return (
    <div
      className={`messagelist ${!isInIframe ? 'desktop-view' : 'iframe-view'}`}
    >
      {Object.keys(userTyping).length && userTyping.email !== user?.email ? (
        <span className="messagelist__typingindicator">
          <>{userTyping.name} is typing</>
        </span>
      ) : null}
    </div>
  );
};

export default MessageList;
