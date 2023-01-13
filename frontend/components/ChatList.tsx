import React, { useEffect, useState } from 'react';
import { FiSettings } from 'react-icons/fi';
import ChatItem from './ChatItem';
import SearchBar from './SearchBar';
import { IUser } from '../interfaces/channeltypes';
import { useSession } from 'next-auth/react';
import { useSocket } from './SocketProvider';

interface Props {
  // setOpenedChat: (e: number) => void;
  // openedChat: undefined | number;
  activeTab: string;
  users: IUser[];
  setCurrentUser: (e: IUser) => void;
  currentUser?: IUser;
}

interface ChannelTypeUsers {
  Guests?: any;
  authUsers?: IUser[];
}
const ChatList = (props: Props) => {
  const { data: session } = useSession();
  const { onlineUsers } = useSocket();
  const { users, activeTab } = props;

  const [channelTypeUsers, setChannelTypeUsers] = useState<ChannelTypeUsers>({
    Guests: [],
    authUsers: [],
  });

  useEffect(() => {
    if (activeTab === 'service') {
      let msg = localStorage.getItem('no-auth-messages');
      let _messages = msg ? JSON.parse(msg) : {};

      const channelUsers = Object.keys(_messages || []);
      setChannelTypeUsers({
        Guests: channelUsers?.map((channel: any) => {
          const addr = _messages?.[channel];
          const message = addr?.find(
            (u: any) => !u.sender.email && u.sender.id
          );
          return {
            addr: channel,
            id: message.sender.id,
          };
        }),
      });
    } else {
      const _users =
        users.filter((user: any) => user.email !== session?.user?.email) || [];
      setChannelTypeUsers({
        authUsers: _users,
      });
    }
  }, [users, activeTab, session]);

  const handleClick = (user: IUser) => {
    props.setCurrentUser(user);
  };

  return (
    <div className="chatlist">
      <div className="chatlist__header">
        <b>Message</b>
        <span className="chatlist__header__settings">
          <FiSettings />
        </span>
      </div>

      {Object.values(channelTypeUsers).map(users =>
        users?.map((user: any, index: number) => (
          <ChatItem
            key={user.id || index}
            isSelected={props.currentUser?.id === user.id}
            handleClick={() => handleClick(user)}
            isOnline={onlineUsers.some(
              (_user: IUser) => _user.email === user.email
            )}
            user={user}
          />
        ))
      )}
    </div>
  );
};

export default ChatList;
