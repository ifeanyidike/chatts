import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import { BsCheck2All } from 'react-icons/bs';
import { HiOutlineUserGroup } from 'react-icons/hi';
import { IoIosSend } from 'react-icons/io';
import useSWRMutation from 'swr/mutation';
import { ICurrentCourse, IUser } from '../interfaces/channeltypes';
import { BASE, noAuthPoster } from '../utils/appUtil';
interface Props {
  handleClick: () => void;
  isSelected: boolean;
  user?: IUser;
  isOnline?: boolean;
  course?: ICurrentCourse;
  activeTab: string;
  groupCourses?: ICurrentCourse[];
  setGroupCourses?: React.Dispatch<React.SetStateAction<ICurrentCourse[]>>;
}
const ChatItem = (props: Props) => {
  const date = new Date();
  const isOnline: boolean | null = props.isOnline || null;
  const profileImage = props.user?.image || '/avatar.png';
  const isEditable = props?.course?.isEditable;
  const [title, setTitle] = useState('');

  const {
    data: _,
    trigger,
    isMutating,
  } = useSWRMutation(`${BASE}/chatcourse/addnew`, noAuthPoster);

  const handleChange = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    const course = {
      ...props.course,
      title,
    };

    try {
      await trigger({
        data: { course },
      });
      if (props.setGroupCourses && props.groupCourses) {
        const _groupCourses = props.groupCourses.map(_course => {
          if (_course.id === course.id) {
            return {
              ...course,
              isEditable: false,
            };
          }
          return _course;
        });
        props.setGroupCourses(_groupCourses);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditContent = (e: React.FormEvent<HTMLElement>) => {
    setTitle(e.currentTarget.outerText);
  };
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
          <div className="info__header">
            <strong
              className="name"
              contentEditable={isEditable}
              onInput={handleEditContent}
            >
              {props.activeTab === 'group'
                ? props?.course?.title
                : props?.user?.name}
            </strong>
            {isEditable && (
              <button onClick={handleChange} disabled={!title}>
                {isMutating ? (
                  <div className="ripple embedded__loader"></div>
                ) : (
                  <IoIosSend />
                )}
              </button>
            )}
          </div>

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
