import React, { useState } from 'react';
import ChatList from './ChatList';
import SearchBar from './SearchBar';
import { IUser } from '../interfaces/channeltypes';

interface Props {
  activeTab: string;
  users: IUser[];
  currentUser?: IUser;
  setCurrentUser: (e: IUser) => void;
}
const ChatBar = ({ activeTab, users, setCurrentUser, currentUser }: Props) => {
  const [openedChat, setOpenedChat] = useState<undefined | number>(undefined);

  return (
    <div className="chatbar">
      <SearchBar activeTab={activeTab} />
      <ChatList
        // setOpenedChat={setOpenedChat}
        // openedChat={openedChat}
        activeTab={activeTab}
        users={users}
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
      />
    </div>
  );
};

export default ChatBar;
