import React, { FC, ReactNode, useState, useEffect, useRef } from 'react';
import useSWR from 'swr';
import { useSocket } from '../components/SocketProvider';
import useTypingIndicator from '../hooks/useTypingIndicator';
// import { ChatWidgetContainer } from '../styles/ChatWidgetStyles';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';

import { Inter } from '@next/font/google';
import EmojiIcon from '../assets/components/EmojiIcon';
import SendIcon from '../assets/components/SendIcon';
import Image from 'next/image';
import ChatButton from '../assets/components/ChatButton';
import CloseIcon from '../assets/components/CloseIcon';
import { useRouter } from 'next/router';
import { BASE, noAuthFetcher } from '../utils/appUtil';

const inter = Inter({ subsets: ['latin'] });
// const fetcher = (...args: any[]) => fetch(...args).then(res => res.json());

const ChatWidget: FC<ReactNode> = (props: any) => {
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
  const [isInIframe, setIsInIframe] = useState(false);

  const { isTyping, handleDown, handleUp } = useTypingIndicator();
  const router = useRouter();
  const { key } = router.query;

  const { data, error } = useSWR(
    key ? `${BASE}/channels/${key}` : null,
    key ? noAuthFetcher : null
  );

  // const fetchData =
  // useEffect(() => {
  //   console.log('ROUTER QUERY', router.query);
  //   if (!router.query.key) return;
  //   (async () => {
  //     const { data } = await axios.get(
  //       `http://localhost:9100/api/channels/${router.query.key}`
  //     );
  //     console.log('QUERY DATA', { data });
  //   })();
  // }, [router.query]);

  // console.log({ data, error });

  console.log({ data, error });

  // useEffect(() => {
  //   const isInIframe = window.location !== window.parent.location;
  //   if (!isInIframe) {
  //     toggleWidget(true);
  //   } else {
  //     toggleWidget(false);
  //   }
  // }, []);

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
    setIsInIframe(window.location !== window.parent.location);
  }, []);

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

  useEffect(() => {
    bindEvent(window, 'message', function (e) {
      // console.log('message from widget', e);
    });
    window.addEventListener('message', e => {
      // console.log('message', e);
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
    handleDown();
    if (!formRef?.current) return;
    if (e.key === 'Enter' && e.shiftKey === false) {
      e.preventDefault();
      socket.emit('onSendMessage', { message, user });
    }
  };

  const openWidget = () => {
    if (!isInIframe) return true;

    return widgetOpen;
  };

  if (data !== undefined && !data)
    throw new Error('Invalid authorization code');
  return (
    <>
      {!openWidget() ? (
        <button className="chaticon" onClick={() => toggleWidget(!widgetOpen)}>
          <ChatButton />
        </button>
      ) : (
        <form
          className={`chatwidget ${inter.className}`}
          ref={formRef}
          onSubmit={handleSubmit}
        >
          <div className="chatwidget__top">
            <div className="chatwidget__topinfo">
              <div className="onlineindicator"></div>
              <span>Chat with us now, we are online</span>
            </div>
            {isInIframe && (
              <button
                className="close"
                onClick={() => toggleWidget(!widgetOpen)}
              >
                <CloseIcon />
              </button>
            )}
          </div>
          <div className="chatwidget__messagelist">
            {userTyping && (
              <span className="messagelist__typingindicator">{userTyping}</span>
            )}
          </div>
          <div className="chatwidget__messageinput">
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
              onKeyUp={handleUp}
              onKeyDown={handleKeyDown}
            />
            {!isInIframe && (
              <button aria-label="Send" className="chatwidget__send">
                <SendIcon />
              </button>
            )}
          </div>
        </form>
      )}
    </>
  );
};

export default ChatWidget;
