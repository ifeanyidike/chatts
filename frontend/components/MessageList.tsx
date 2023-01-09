import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useSocket } from './SocketProvider';
import {
  IChatMessage,
  ICurrentCourse,
  IUser,
} from '../interfaces/channeltypes';
import { useSession } from 'next-auth/react';
import router from 'next/router';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import Image from 'next/image';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

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

  const formatTime = (d: Date) => {
    var h = d.getHours();
    return (
      (h % 12 || 12) +
      ':' +
      d.getMinutes().toString().padStart(2, '0') +
      ' ' +
      (h < 12 ? 'A' : 'P') +
      'M'
    );
  };

  const formattedDateTime = (dateTime: Date) => {
    const today = new Date();
    const targetDate = new Date(dateTime);
    if (today.toLocaleDateString() === targetDate.toLocaleDateString()) {
      return 'Today at ' + formatTime(targetDate);
    }
    return new Date(dateTime).toLocaleDateString();
  };

  return (
    <div
      id="messages"
      className={`messagelist ${!isInIframe ? 'desktop-view' : 'iframe-view'}`}
    >
      <>
        {messages?.map(data => {
          const userImage = data?.user?.image || '/avatar.png';
          const currentTime = data.createdAt;
          return (
            <div
              key={data.id}
              className={`message ${
                data.user?.email === user?.email ? 'own-message' : ''
              }`}
            >
              <div className="message__content">
                <MessageItemImage userImage={userImage} />

                <p className="message__text">{data.text}</p>
                <MoreHorizIcon className="message__more" />
              </div>
              <small className="message__time">
                {currentTime ? formattedDateTime(currentTime) : null}
              </small>
            </div>
          );
        })}
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

const MessageItemImage = ({ userImage }: any) => {
  const [failedToLoad, setFailedToLoad] = useState<boolean>(false);
  const image: string = failedToLoad ? '/avatar.png' : userImage;
  return (
    <div className="message__image">
      <Image
        src={image}
        alt="User"
        width="29"
        height="29"
        onError={() => setFailedToLoad(true)}
      />
    </div>
  );
};
