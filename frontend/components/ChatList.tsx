import React from 'react';
import { FiSettings } from 'react-icons/fi';
import ChatItem from './ChatItem';
import SearchBar from './SearchBar';

interface Props {
  setOpenedChat: (e: number) => void;
  openedChat: undefined | number;
}
const ChatList = (props: Props) => {
  return (
    <div className="chatlist">
      <div className="chatlist__header">
        <b>Message</b>
        <span className="chatlist__header__settings">
          <FiSettings />
        </span>
      </div>
      {[1, 2, 3, 4, 5].map(el => (
        <ChatItem
          key={el}
          isSelected={props.openedChat === el}
          handleClick={() => props.setOpenedChat(el)}
        />
      ))}
    </div>
  );
};

export default ChatList;
