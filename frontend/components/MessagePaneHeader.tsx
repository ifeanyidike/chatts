import Image from 'next/image';
import React from 'react';
import { BiVideo } from 'react-icons/bi';
import { FiSettings } from 'react-icons/fi';
import { HiOutlineUserGroup } from 'react-icons/hi';
import { IoCallOutline } from 'react-icons/io5';
import { useSelector } from 'react-redux';
import { ICurrentCourse, IUser } from '../interfaces/channeltypes';
import { RootState } from '../redux/store';

interface Props {
  activeTab: string;
}

const MessagePaneHeader = (props: Props) => {
  const { currentUser } = useSelector((state: RootState) => state.user);
  const { selectedCourse } = useSelector((state: RootState) => state.course);
  const profileImage = currentUser?.image || '/avatar.png';

  return (
    <div className="messagepane__header">
      <h2>Message Detail</h2>

      <div className="header__details">
        <div className="header__left">
          <div className="header__profile-image">
            {props.activeTab !== 'group' ? (
              <Image src={profileImage} width="42" height="42" alt="Avatar" />
            ) : (
              <HiOutlineUserGroup />
            )}
          </div>
          <div className="header__info">
            <strong className="name">
              {props.activeTab === 'group'
                ? selectedCourse?.title
                : currentUser?.name}
            </strong>
            <p className="status">
              <i>No communication yet</i>
            </p>
          </div>
        </div>

        <div className="header__right">
          <span>
            <IoCallOutline />
          </span>
          <span>
            <BiVideo />
          </span>
          <span>
            <FiSettings />
          </span>
        </div>
      </div>
    </div>
  );
};

export default MessagePaneHeader;
