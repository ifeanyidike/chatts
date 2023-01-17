import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useSocket } from './SocketProvider';
import {
  IChatMessage,
  ICurrentCourse,
  IUser,
} from '../interfaces/channeltypes';
import { useSession } from 'next-auth/react';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import Message from './Message';
import axios from 'axios';
import { BASE } from '../utils/appUtil';
import { RippleLoader } from './Loaders';
import { getGuestMessages } from '../utils/generalUtils';
import { useRouter } from 'next/router';
import GuestInfo from './GuestInfo';
import { useDispatch } from 'react-redux';
import { setMessageFlag } from '../redux/slices/general';

interface Props {
  isTyping?: boolean;
  isInIframe?: boolean;
  currentUser?: IUser;
  currentCourse?: any;
  setMessages: Dispatch<SetStateAction<IChatMessage[]>>;
  messages: IChatMessage[];
  scrollTargetRef: React.MutableRefObject<HTMLDivElement>;
  activeTab?: string;
  widgetUser?: any;
  setWidgetUser?: Dispatch<SetStateAction<IUser>>;
  widgetLocation?: string;
}

interface IUserTyping {
  name?: string;
  email?: string;
}

const MessageList = (props: Props) => {
  const { socket } = useSocket();
  const {
    isTyping,
    isInIframe,
    messages,
    setMessages,
    widgetUser,
    setWidgetUser,
    widgetLocation,
    currentCourse,
  } = props;
  const [userTyping, setUserTyping] = useState<IUserTyping>({});

  const { data: session } = useSession();
  const dispatch = useDispatch();
  const tab = useSelector((state: RootState) => state.general.tab);

  const { query } = useRouter();

  const course = currentCourse?.id
    ? currentCourse
    : currentCourse?.length
    ? props.currentCourse[0]
    : null;

  const user = session?.user ||
    widgetUser || {
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

    socket.on('onUserTyping', (data: any) => {
      if (data.isTyping) {
        const { name, email } = data.user || {};
        setUserTyping({ name, email });
      } else {
        setUserTyping({});
      }
    });
  }, [socket]);

  useEffect(() => {
    document
      ?.getElementById('chatts__scrollto__element')
      ?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on('onReceiveMessage', (data: any) => {
      const courseId =
        course?.chatcourseId || course?.id || widgetUser?.chatcourseId;

      if (courseId !== data.chatcourseId) {
        return;
      }

      if (data.type !== tab && !isInIframe) {
        return;
      }

      if (tab !== 'group' && data?.user?.email !== user?.email) {
        dispatch(setMessageFlag({ type: tab, isNew: true }));
      }

      const formattedMessage: IChatMessage = data;
      setMessages([...messages, formattedMessage]);

      // props.messageListRef.current.scrollTop =
      //   props.messageListRef?.current?.scrollHeight;
      // props.scrollTargetRef.current.scrollIntoView({ behavior: 'smooth' });
      document
        ?.getElementById('chatts__scrollto__element')
        ?.scrollIntoView({ behavior: 'smooth' });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket, session, messages, tab, course, widgetUser]);

  return (
    <div
      id="messages"
      className={`messagelist ${!isInIframe ? 'desktop-view' : 'iframe-view'}`}
    >
      <div className="messages__content">
        {isInIframe && user.name === 'Guest' && (
          <GuestInfo
            widgetLocation={widgetLocation}
            setMessages={setMessages}
            setWidgetUser={setWidgetUser}
          />
        )}
        {messages?.map((data, idx) => (
          <Message key={data.id || idx} data={data} widgetUser={widgetUser} />
        ))}
        <div
          id="chatts__scrollto__element"
          style={{ marginTop: '30px' }}
          ref={props.scrollTargetRef}
        ></div>
      </div>

      {Object.keys(userTyping).length && userTyping.email !== user?.email ? (
        <span className="messagelist__typingindicator">
          <>{userTyping.name} is typing</>
        </span>
      ) : null}
    </div>
  );
};

export default MessageList;
