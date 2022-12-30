import React, { useEffect, useState, useRef } from 'react';
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';
import EmojiIcon from '../assets/components/EmojiIcon';
import useTypingIndicator from '../hooks/useTypingIndicator';
import { useSocket } from './SocketProvider';
import SendIcon from '../assets/components/SendIcon';

interface Props {
  isInIframe: boolean;
  setIsTyping: (e: undefined | boolean) => void;
}
const MessageInput = (props: Props) => {
  const { isInIframe, setIsTyping } = props;
  const user = {
    id: undefined,
    email: undefined,
    name: 'Guest',
  };
  const [openEmoji, setOpenEmoji] = useState<boolean>(false);
  const inputRef = useRef<null | HTMLTextAreaElement>(null);
  const formRef = useRef<null | HTMLFormElement>(null);
  const [message, setMessage] = useState<string>('');

  const { isTyping, handleDown, handleUp } = useTypingIndicator();
  const { socket } = useSocket();

  useEffect(() => {
    setIsTyping(isTyping);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTyping]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    handleDown();
    if (!formRef?.current) return;
    if (e.key === 'Enter' && e.shiftKey === false) {
      e.preventDefault();
      socket.emit('onSendMessage', { message, user });
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    socket.emit('onSendMessage', { message, user });
  };

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className={`messageinput ${!isInIframe ? 'desktop-view' : 'iframe-view'}`}
    >
      {openEmoji && (
        <div className="emojipicker">
          <Picker data={data} onEmojiSelect={console.log} />
        </div>
      )}
      <EmojiIcon
        className="emojiopener"
        openEmoji={openEmoji}
        setOpenEmoji={setOpenEmoji}
      />
      <textarea
        className="input"
        ref={inputRef}
        onChange={e => setMessage(e.target.value)}
        onKeyUp={handleUp}
        onKeyDown={handleKeyDown}
      />
      {!isInIframe && (
        <button aria-label="Send" className="send">
          <SendIcon />
        </button>
      )}
    </form>
  );
};

export default MessageInput;
