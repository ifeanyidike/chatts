import React, { useState } from 'react';
import ChatList from './ChatList';
import SearchBar from './SearchBar';
import { IUser } from '../interfaces/channeltypes';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

interface Props {
  users: IUser[];
  currentUser?: IUser;
  setCurrentUser: (e: IUser) => void;
}
const ChatBar = ({ users, setCurrentUser, currentUser }: Props) => {
  const tab = useSelector((state: RootState) => state.general.tab);

  return (
    <div className="chatbar">
      <SearchBar activeTab={tab} />
      <ChatList
        activeTab={tab}
        users={users}
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
      />
    </div>
  );
};

export default ChatBar;
