import { User } from '@next-auth/sequelize-adapter/dist/models';
import Image from 'next/image';
import React from 'react';
import { BsCheck2All } from 'react-icons/bs';
import { IUser } from '../interfaces/channeltypes';
interface Props {
  handleClick: () => void;
  isSelected: boolean;
  user: IUser;
  isOnline: boolean;
}
const ChatItem = (props: Props) => {
  const date = new Date();
  const isOnline: boolean = props.isOnline;
  const profileImage = props.user?.image || '/avatar.png';
  return (
    <div
      className={`chatitem ${props.isSelected ? 'chatitem__selected' : ''} `}
      onClick={props.handleClick}
    >
      <div className="chatitem__left">
        <div className="chatitem__profile-image">
          <div className={`onlinestatus ${isOnline ? 'online' : ''}`}></div>
          <Image src={profileImage} width="42" height="42" alt="Avatar" />
        </div>
        <div className="chatitem__messageinfo">
          <strong className="name">{props.user.name}</strong>
          <p className="message">
            <i>No communication yet</i>
          </p>
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
