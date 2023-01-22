import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useSocket } from './SocketProvider';
import { IUser } from '../interfaces/channeltypes';
import { useSession } from 'next-auth/react';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import Message from './Message';
import GuestInfo from './GuestInfo';

interface Props {
  isTyping?: boolean;
  isInIframe?: boolean;
  currentCourse?: any;
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
  const { isTyping, isInIframe, widgetUser, setWidgetUser, widgetLocation } =
    props;
  const [userTyping, setUserTyping] = useState<IUserTyping>({});

  const { data: session } = useSession();
  const { messages } = useSelector((state: RootState) => state.message);

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

  return (
    <div
      id="messages"
      className={`messagelist ${!isInIframe ? 'desktop-view' : 'iframe-view'}`}
    >
      <div className="messages__content">
        {isInIframe && user.name === 'Guest' && (
          <GuestInfo
            widgetLocation={widgetLocation}
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
