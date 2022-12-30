import React, { useState } from 'react';
import ChatList from './ChatList';
import SearchBar from './SearchBar';

const ChatBar = () => {
  const [openedChat, setOpenedChat] = useState<undefined | number>(undefined);
  return (
    <div className="chatbar">
      <SearchBar />
      <ChatList setOpenedChat={setOpenedChat} openedChat={openedChat} />
    </div>
  );
};

export default ChatBar;
