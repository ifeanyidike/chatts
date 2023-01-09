import React, { FC, ReactNode, useState, useEffect, useRef } from 'react';
import useSWR from 'swr';
import { useSocket } from '../components/SocketProvider';

import { Inter } from '@next/font/google';
import ChatButton from '../assets/components/ChatButton';
import CloseIcon from '../assets/components/CloseIcon';
import { useRouter } from 'next/router';
import { BASE, noAuthFetcher } from '../utils/appUtil';
import MessageInput from '../components/MessageInput';
import MessageList from '../components/MessageList';
import { useSession } from 'next-auth/react';
import { IChatMessage } from '../interfaces/channeltypes';

const inter = Inter({ subsets: ['latin'] });

const ChatWidget: FC<ReactNode> = (props: any) => {
  const [widgetOpen, toggleWidget] = useState<undefined | boolean>(undefined);
  const [isInIframe, setIsInIframe] = useState(false);
  const [isTyping, setIsTyping] = useState<undefined | boolean>(undefined);
  const [messages, setMessages] = useState<IChatMessage[]>([]);
  const scrollTargetRef = useRef() as React.MutableRefObject<HTMLDivElement>;
  const { socket } = useSocket();
  const { data: session } = useSession();

  const router = useRouter();
  const { key } = router.query;

  const { data, error } = useSWR(
    key ? `${BASE}/channels/${key}` : null,
    key ? noAuthFetcher : null
  );

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

  const openWidget = () => {
    if (!isInIframe) return true;

    return widgetOpen;
  };

  // if (data !== undefined && !data)
  //   throw new Error('Invalid authorization code');
  console.log({ socket });

  useEffect(() => {
    //  if (!session?.user?.email || !key || !socket) return;
    //  socket.auth = { user: session.user, channel: key };

    socket?.connect();
    console.log(socket);
  }, [socket]);
  return (
    <>
      {!openWidget() ? (
        <button className="chaticon" onClick={() => toggleWidget(!widgetOpen)}>
          <ChatButton />
        </button>
      ) : (
        <div className={`chatwidget ${inter.className}`}>
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
          <MessageList
            isInIframe={isInIframe}
            isTyping={isTyping}
            setMessages={setMessages}
            messages={messages}
            scrollTargetRef={scrollTargetRef}
          />
          <MessageInput
            isInIframe={isInIframe}
            setIsTyping={setIsTyping}
            from="serviceguest"
            setMessages={setMessages}
            messages={messages}
            scrollTargetRef={scrollTargetRef}
          />
        </div>
      )}
    </>
  );
};

export default ChatWidget;
