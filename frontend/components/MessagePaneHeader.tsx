import Image from 'next/image';
import React from 'react';
import { BiVideo } from 'react-icons/bi';
import { FiSettings } from 'react-icons/fi';
import { IoCallOutline } from 'react-icons/io5';

const MessagePaneHeader = () => {
  return (
    <div className="messagepane__header">
      <h2>Message Detail</h2>

      <div className="header__details">
        <div className="header__left">
          <div className="header__profile-image">
            <Image src="/avatar.png" width="42" height="42" alt="Avatar" />
          </div>
          <div className="header__info">
            <strong className="name">Ifeanyi Dike</strong>
            <p className="status">This is the image</p>
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
