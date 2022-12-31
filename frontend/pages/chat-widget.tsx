import React, { FC, ReactNode, useState, useEffect } from 'react';
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

const inter = Inter({ subsets: ['latin'] });

const ChatWidget: FC<ReactNode> = (props: any) => {
  const [widgetOpen, toggleWidget] = useState<undefined | boolean>(undefined);
  const [isInIframe, setIsInIframe] = useState(false);
  const [isTyping, setIsTyping] = useState<undefined | boolean>(undefined);
  const { data: session } = useSession();
  console.log({ session });

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
          <MessageList isInIframe={isInIframe} isTyping={isTyping} />
          <MessageInput isInIframe={isInIframe} setIsTyping={setIsTyping} />
        </div>
      )}
    </>
  );
};

export default ChatWidget;
