import React, { useEffect, useState } from 'react';
import { FiSettings } from 'react-icons/fi';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import ChatItem from './ChatItem';
import SearchBar from './SearchBar';
import { IUser } from '../interfaces/channeltypes';
import { useSession } from 'next-auth/react';
import { useSocket } from './SocketProvider';
import { BASE, noAuthFetcher } from '../utils/appUtil';

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
  const [hasGuests, setHasGuests] = useState<boolean>(false);
  const { query } = useRouter();
  const { key } = query;

  const [channelTypeUsers, setChannelTypeUsers] = useState<ChannelTypeUsers>({
    Guests: [],
    authUsers: [],
  });

  const { data: course, error } = useSWR(
    key && activeTab !== 'direct'
      ? `${BASE}/chatcourse/${key}?type=${activeTab}`
      : null,
    key ? noAuthFetcher : null
  );

  useEffect(() => {
    if (activeTab === 'service' && course) {
      let msg = localStorage.getItem('no-auth-messages');
      let _messages = msg ? JSON.parse(msg) : {};

      const channelUsers = Object.keys(_messages || []);
      const guests = channelUsers?.map((channel: any) => {
        const addr = _messages?.[channel];

        // const message = addr?.find((u: any) => !u.user.email && u.user.id);
        return {
          name: channel,
          id: addr[0].guestId,
        };
      });

      const authUsers = course?.map((c: any) => {
        const currentUser = c.users.find(
          (u: any) => u.email !== session?.user?.email
        );
        return {
          name: c.title,
          tags: c.tags,
          id: currentUser.id,
          currentUser,
        };
      });
      const hasGuests = !!guests.length;
      setHasGuests(hasGuests);

      setChannelTypeUsers({
        Guests: guests,
        authUsers,
      });
    } else {
      const _users =
        users.filter((user: any) => user.email !== session?.user?.email) || [];
      setChannelTypeUsers({
        authUsers: _users,
      });
    }
  }, [users, activeTab, session, course]);

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

      {Object.entries(channelTypeUsers).map(([tag, users]) => {
        const isGuest = tag === 'Guests';
        const hasUsers = tag !== 'Guests' && users.length;
        return (
          <React.Fragment key={tag}>
            {hasGuests && isGuest ? (
              <h4>{tag}</h4>
            ) : hasUsers ? (
              <h4>Users</h4>
            ) : null}
            {users?.map((user: any, index: number) => (
              <ChatItem
                key={user.id || index}
                isSelected={props.currentUser?.id === user.id}
                handleClick={() => handleClick({ ...user, isGuest })}
                isOnline={onlineUsers.some(
                  (_user: IUser) =>
                    _user.email === user.email ||
                    _user.email === user.currentUser?.email
                )}
                user={{ ...user, isGuest }}
              />
            ))}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default ChatList;
