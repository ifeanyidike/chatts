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
    if (!socket) return;
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
  }, [socket, session, messages, tab, course]);

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
