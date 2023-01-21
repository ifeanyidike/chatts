import { User } from '@next-auth/sequelize-adapter/dist/models';
import Image from 'next/image';
import React from 'react';
import { BsCheck2All } from 'react-icons/bs';
import { HiOutlineUserGroup } from 'react-icons/hi';
import { ICurrentCourse, IUser } from '../interfaces/channeltypes';
interface Props {
  handleClick: () => void;
  isSelected: boolean;
  user?: IUser;
  isOnline?: boolean;
  course?: ICurrentCourse;
  activeTab: string;
}
const ChatItem = (props: Props) => {
  const date = new Date();
  const isOnline: boolean | null = props.isOnline || null;
  const profileImage = props.user?.image || '/avatar.png';
  return (
    <div
      className={`chatitem ${props.isSelected ? 'chatitem__selected' : ''} `}
      onClick={props.handleClick}
    >
      <div className="chatitem__left">
        <div className="chatitem__profile-image">
          {props.activeTab !== 'group' ? (
            <>
              <div className={`onlinestatus ${isOnline ? 'online' : ''}`}></div>
              <Image src={profileImage} width="42" height="42" alt="Avatar" />
            </>
          ) : (
            <HiOutlineUserGroup />
          )}
        </div>
        <div className="chatitem__messageinfo">
          <strong className="name" contentEditable={props?.course?.isEditable}>
            {props.activeTab === 'group'
              ? props?.course?.title
              : props?.user?.name}
          </strong>
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
