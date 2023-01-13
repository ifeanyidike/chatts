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

interface Props {
  isTyping?: boolean;
  isInIframe?: boolean;
  currentUser?: IUser;
  currentCourse?: ICurrentCourse[];
  setMessages: Dispatch<SetStateAction<IChatMessage[]>>;
  messages: IChatMessage[];
  scrollTargetRef: React.MutableRefObject<HTMLDivElement>;
  activeTab?: string;
}

interface IUserTyping {
  name?: string;
  email?: string;
}

const MessageList = (props: Props) => {
  const { socket } = useSocket();
  const { isTyping, isInIframe, messages, setMessages } = props;
  const [userTyping, setUserTyping] = useState<IUserTyping>({});
  const { data: session } = useSession();
  const tab = useSelector((state: RootState) => state.general.tab);
  const [noAuthServiceMessages, setNoAuthServiceMessages] = useState<any>({});

  const course = props.currentCourse?.length ? props.currentCourse[0] : null;

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
    if (!socket || tab === 'service') return;
    socket.on('onReceiveMessage', (data: any) => {
      if (course?.chatcourseId !== data.chatcourseId) {
        return;
      }
      const formattedMessage: IChatMessage = data;

      setMessages([...messages, formattedMessage]);

      // props.messageListRef.current.scrollTop =
      //   props.messageListRef?.current?.scrollHeight;
      props.scrollTargetRef.current.scrollIntoView({ behavior: 'smooth' });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket, session, messages, tab, course, noAuthServiceMessages]);

  useEffect(() => {
    const isInService = window.location.pathname.includes('chat-widget');
    console.log({ isInService });
    if (!socket || (!isInService && tab !== 'service')) return;
    console.log({ tab });

    socket.on('onReceiveServiceMessage', (data: any) => {
      console.log(data);
      const messages = noAuthServiceMessages;
      if (!messages.hasOwnProperty(data.location)) {
        messages[data.location] = [];
      }
      const item = {
        user: data.sender,
        text: data.text,
        createdAt: data.createdAt,
      };
      const exists = messages[data.location].some(
        (m: any) => JSON.stringify(item) === JSON.stringify(m)
      );
      if (!exists) {
        messages[data.location].push(item);
      }
      console.log(messages);
      localStorage.setItem('no-auth-messages', JSON.stringify(messages));
      setNoAuthServiceMessages(messages);

      // if (course?.chatcourseId !== data.chatcourseId) {
      //   return;
      // }
      // const formattedMessage: IChatMessage = data;
      // setMessages([...messages, formattedMessage]);
      // // props.messageListRef.current.scrollTop =
      // //   props.messageListRef?.current?.scrollHeight;
      // props.scrollTargetRef.current.scrollIntoView({ behavior: 'smooth' });
    });
  }, [socket, session, messages, tab, course, noAuthServiceMessages]);

  useEffect(() => {
    console.log({ noAuthServiceMessages });
  }, [noAuthServiceMessages]);
  return (
    <div
      id="messages"
      className={`messagelist ${!isInIframe ? 'desktop-view' : 'iframe-view'}`}
    >
      <>
        {messages?.map(data => (
          <Message key={data.id} data={data} />
        ))}
        <div
          style={{ float: 'left', clear: 'both' }}
          ref={props.scrollTargetRef}
        ></div>
      </>

      {Object.keys(userTyping).length && userTyping.email !== user?.email ? (
        <span className="messagelist__typingindicator">
          <>{userTyping.name} is typing</>
        </span>
      ) : null}
    </div>
  );
};

export default MessageList;
