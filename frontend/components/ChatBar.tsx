import React, { useState } from 'react';
import ChatList from './ChatList';
import SearchBar from './SearchBar';
import { ICurrentCourse, IUser } from '../interfaces/channeltypes';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

interface Props {
  users: IUser[];
  courses: ICurrentCourse[];
}
const ChatBar = (props: Props) => {
  const { users, courses } = props;
  const tab = useSelector((state: RootState) => state.general.tab);

  return (
    <div className="chatbar">
      <SearchBar activeTab={tab} />
      <ChatList activeTab={tab} users={users} courses={courses} />
    </div>
  );
};

export default ChatBar;
