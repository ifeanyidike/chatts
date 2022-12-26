import { Socket } from 'socket.io-client';

interface User {
  id: undefined | string;
  name: string;
  email: undefined | string;
}

export const handleDetectUserTyping = (
  user: User,
  isTyping: boolean,
  setIsTyping: any,
  socket: Socket
): void => {
  let timeout: undefined | NodeJS.Timeout = undefined;
  const timeoutFunction = () => {
    setIsTyping(false);
    socket.emit('isTyping', { isTyping: false, user });
  };

  if (!isTyping) {
    setIsTyping(true);
    socket.emit('isTyping', { isTyping: true, user });
    timeout = setTimeout(timeoutFunction, 5000);
  } else {
    clearTimeout(timeout);
    timeout = setTimeout(timeoutFunction, 5000);
  }
};
