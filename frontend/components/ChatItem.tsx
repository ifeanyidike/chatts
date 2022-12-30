import Image from 'next/image';
import React from 'react';
import { BsCheck2All } from 'react-icons/bs';

interface Props {
  handleClick: () => void;
  isSelected: boolean;
}
const ChatItem = (props: Props) => {
  const date = new Date();
  return (
    <div
      className={`chatitem ${props.isSelected ? 'chatitem__selected' : ''} `}
      onClick={props.handleClick}
    >
      <div className="chatitem__left">
        <div className="chatitem__profile-image">
          <Image src="/avatar.png" width="42" height="42" alt="Avatar" />
        </div>
        <div className="chatitem__messageinfo">
          <strong className="name">Ifeanyi Dike</strong>
          <p className="message">This is the image</p>
        </div>
      </div>
      <div className="chatitem__otherinfo">
        <span className="time">{`${date.getHours()}:${date.getMinutes()}`}</span>
        <p className="delivery">
          <BsCheck2All />
        </p>
      </div>
    </div>
  );
};

export default ChatItem;
