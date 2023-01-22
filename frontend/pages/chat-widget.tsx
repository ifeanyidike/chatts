import React, { FC, ReactNode, useState, useEffect, useRef } from 'react';
import useSWR from 'swr';
import { useSocket } from '../components/SocketProvider';
import axios from 'axios';

import { Inter } from '@next/font/google';
import ChatButton from '../assets/components/ChatButton';
import CloseIcon from '../assets/components/CloseIcon';
import { useRouter } from 'next/router';
import { BASE, noAuthFetcher } from '../utils/appUtil';
import MessageInput from '../components/MessageInput';
import MessageList from '../components/MessageList';
import { useSession } from 'next-auth/react';
import { IChatMessage, IUser } from '../interfaces/channeltypes';
import { io, Socket } from 'socket.io-client';
import useHandleServiceReceivedMessage from '../hooks/useHandleServiceReceivedMessage';
import useHandleMessages from '../hooks/useHandleMessages';
import { getGuestMessages } from '../utils/generalUtils';
import { useDispatch } from 'react-redux';
import { setMessages } from '../redux/slices/message';

const inter = Inter({ subsets: ['latin'] });

interface IRouter {
  key?: string;
  location?: string;
}

interface WidgetUser {
  id?: string;
  name?: string;
  email?: string;
  image?: string;
  emailVerified?: string;
  createdAt?: Date;
  updatedAt?: Date;
  chatcourseId?: string;
  isGuest?: boolean;
}

interface Props {
  widgetUser: WidgetUser;
  messages: any;
  admin: IUser;
  user: WidgetUser;
}

const ChatWidget = (props: Props) => {
  const [widgetOpen, toggleWidget] = useState<undefined | boolean>(undefined);
  const [isInIframe, setIsInIframe] = useState(false);
  const [isTyping, setIsTyping] = useState<undefined | boolean>(undefined);
  const scrollTargetRef = useRef() as React.MutableRefObject<HTMLDivElement>;
  let { socket, onlineUsers } = useSocket();
  const { data: session } = useSession();
  const [widgetUser, setWidgetUser] = useState<WidgetUser>({});
  const [isAdminOnline, setIsAdminOnline] = useState(false);
  const dispatch = useDispatch();

  const noAuthServiceMessages = useHandleServiceReceivedMessage();

  const router = useRouter();
  const { key, location }: IRouter = router.query;

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
    const _isAdminOnline = onlineUsers.some(
      (user: IUser) => user.email === props.admin.email
    );
    setIsAdminOnline(_isAdminOnline);
  }, [onlineUsers, props.admin.email]);

  useEffect(() => {
    setIsInIframe(window.location !== window.parent.location);
  }, []);

  useEffect(() => {
    bindEvent(window, 'message', function (e) {
      console.log('message from widget', e);
    });
    window.addEventListener('message', e => {
      // console.log('message', e);
    });
  }, [widgetOpen]);

  useEffect(() => {
    if (props.user) {
      setWidgetUser(props.user);
    } else if (!widgetUser.email) {
      const wUser = localStorage.getItem('widgetUser');

      const _widgetUser = wUser
        ? JSON.parse(wUser)
        : { id: undefined, email: undefined, image: undefined, name: 'Guest' };

      if (!_widgetUser.id) _widgetUser.id = window.crypto.randomUUID();

      localStorage.setItem('widgetUser', JSON.stringify(_widgetUser));

      setWidgetUser(_widgetUser);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [widgetUser.email, location, props.widgetUser]);

  useEffect(() => {
    if (widgetOpen === undefined) return;
    window.parent.postMessage('chatts__loaded', '*');
  }, [widgetOpen]);

  const openWidget = () => {
    if (!isInIframe) return true;

    return widgetOpen;
  };

  useEffect(() => {
    if (!key || !location || !socket) return;
    socket.auth = {
      user: widgetUser,
      channel: key,
      location,
      isCustomer: window.location.pathname.includes('chat-widget'),
    };

    socket.connect();
  }, [socket, widgetUser, key, location]);

  useEffect(() => {
    if (!widgetUser?.id) return;

    if (props.messages) {
      dispatch(setMessages(props.messages));
    } else if (widgetUser?.isGuest || widgetUser.name === 'Guest') {
      let guestMessages: any = getGuestMessages(noAuthServiceMessages);
      let addr = location || '';
      const _messages = guestMessages?.[addr] || [];

      dispatch(setMessages(_messages));
    } else {
      dispatch(setMessages([]));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [widgetUser?.id, noAuthServiceMessages, location, props.messages]);

  useHandleMessages({
    courseId: widgetUser?.chatcourseId,
    user: widgetUser,
    isInIframe: true,
  });

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
              <div
                className={`onlineindicator ${isAdminOnline ? 'isonline' : ''}`}
              ></div>
              {isAdminOnline ? (
                <span>Chat with us now, we are online</span>
              ) : (
                <span>Admin is currently offline</span>
              )}
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
            scrollTargetRef={scrollTargetRef}
            widgetUser={widgetUser}
            setWidgetUser={setWidgetUser}
            widgetLocation={location}
          />
          <MessageInput
            isInIframe={isInIframe}
            setIsTyping={setIsTyping}
            from="serviceguest"
            chatcourseId={widgetUser?.chatcourseId}
            scrollTargetRef={scrollTargetRef}
            admin={props.admin}
          />
        </div>
      )}
    </>
  );
};

export default ChatWidget;

export const getServerSideProps = async (context: any) => {
  const addr: string = context.query.location;
  const key: string = context.query.key;

  const { data } = await axios.get(
    `${BASE}/users/messages?loc=${addr}&key=${key}`
  );

  if (data) {
    return {
      props: { ...data },
    };
  }

  return {
    props: {},
  };
};
