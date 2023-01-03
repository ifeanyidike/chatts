import React from 'react';
import { FiSettings } from 'react-icons/fi';
import ChatItem from './ChatItem';
import SearchBar from './SearchBar';
import { IUser } from '../interfaces/channeltypes';
import { useSession } from 'next-auth/react';

interface Props {
  // setOpenedChat: (e: number) => void;
  // openedChat: undefined | number;
  activeTab: string;
  users: IUser[];
  setCurrentUser: (e: IUser) => void;
  currentUser?: IUser;
}
const ChatList = (props: Props) => {
  const { data: session } = useSession();
  const users = props.users;

  return (
    <div className="chatlist">
      <div className="chatlist__header">
        <b>Message</b>
        <span className="chatlist__header__settings">
          <FiSettings />
        </span>
      </div>
      {(
        users?.filter((user: any) => user.email !== session?.user?.email) || []
      )?.map((user: any) => (
        <ChatItem
          key={user.id}
          isSelected={props.currentUser?.id === user.id}
          handleClick={() => props.setCurrentUser(user)}
          user={user}
        />
      ))}
    </div>
  );
};

export default ChatList;
