import React, { FC, ReactNode, useState, useEffect, useRef } from 'react';
import { useSocket } from '../components/SocketProvider';
import useTypingIndicator from '../hooks/useTypingIndicator';
// import { ChatWidgetContainer } from '../styles/ChatWidgetStyles';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import loadingProgress from '../assets/gifs/loading_progress.gif';

import { Inter } from '@next/font/google';
import EmojiIcon from '../assets/components/EmojiIcon';
import SendIcon from '../assets/components/SendIcon';
import Image from 'next/image';
const inter = Inter({ subsets: ['latin'] });

const ChatWidget: FC<ReactNode> = () => {
  const user = {
    id: undefined,
    email: undefined,
    name: 'Guest',
  };
  const inputRef = useRef<null | HTMLTextAreaElement>(null);
  const formRef = useRef<null | HTMLFormElement>(null);
  const [openEmoji, setOpenEmoji] = useState<boolean>(false);

  const [message, setMessage] = useState<string>('');
  const { socket } = useSocket();
  const [userTyping, setUserTyping] = useState('');
  const [widgetOpen, toggleWidget] = useState<undefined | boolean>(undefined);

  const isTyping = useTypingIndicator(inputRef);

  const bindEvent = (
    element: Window | Document,
    eventName: string,
    eventHandler: (e: any) => void
  ) => {
    if (element.addEventListener) {
      element.addEventListener(eventName, eventHandler, false);
    }
  };

  useEffect(() => {
    if (isTyping === undefined || !socket) return;
    socket.emit('isTyping', { isTyping, user });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTyping, socket]);

  useEffect(() => {
    if (!socket) return;
    socket.on('message', (data: any) => console.log({ data }));
    socket.on('isTyping', (data: any) => {
      if (data.isTyping) {
        setUserTyping(`${data.user.name} is typing`);
      } else {
        setUserTyping('');
      }
    });
  }, [socket]);

  useEffect(() => {
    bindEvent(window, 'message', function (e) {
      console.log('message from widget', e);
    });
    window.addEventListener('message', e => {
      console.log('message', e);
    });
  }, [widgetOpen]);

  useEffect(() => {
    if (widgetOpen === undefined) return;
    window.parent.postMessage('chatts__loaded', '*');
  }, [widgetOpen]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    socket.emit('onSendMessage', { message, user });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (!formRef?.current) return;
    if (e.key === 'Enter' && e.shiftKey === false) {
      e.preventDefault();
      socket.emit('onSendMessage', { message, user });
    }
  };

  return (
    <>
      {!widgetOpen ? (
        <button onClick={() => toggleWidget(!widgetOpen)}>Trigger</button>
      ) : (
        <form
          className={`chatwidget ${inter.className}`}
          ref={formRef}
          onSubmit={handleSubmit}
        >
          <button onClick={() => toggleWidget(!widgetOpen)}>Close</button>
          <div className="chatwidget__messagelist">
            {userTyping && (
              <span className="messagelist__typingindicator">{userTyping}</span>
            )}
          </div>
          {openEmoji && (
            <div className="chatwidget__emojipicker">
              <Picker data={data} onEmojiSelect={console.log} />
            </div>
          )}
          <EmojiIcon
            className="chatwidget__emojiopener"
            openEmoji={openEmoji}
            setOpenEmoji={setOpenEmoji}
          />
          <textarea
            className="chatwidget__input"
            ref={inputRef}
            onChange={e => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button aria-label="Send" className="chatwidget__send">
            <SendIcon />
          </button>
          {/* <button onClick={handleClick}>Send Socket</button> */}
        </form>
      )}
    </>
  );
};

export default ChatWidget;
