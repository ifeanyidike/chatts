import React, { useEffect, useState } from 'react';
import { useSocket } from './SocketProvider';

interface Props {
  isTyping: undefined | boolean;
  isInIframe: undefined | boolean;
}
const MessageList = (props: Props) => {
  const { socket } = useSocket();
  const { isTyping, isInIframe } = props;
  const [userTyping, setUserTyping] = useState('');

  const user = {
    id: undefined,
    email: undefined,
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
      if (data.isTyping) {
        setUserTyping(`${data.user.name} is typing`);
      } else {
        setUserTyping('');
      }
    });
  }, [socket]);

  return (
    <div
      className={`messagelist ${!isInIframe ? 'desktop-view' : 'iframe-view'}`}
    >
      {userTyping && (
        <span className="messagelist__typingindicator">{userTyping}</span>
      )}
    </div>
  );
};

export default MessageList;
