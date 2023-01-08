import React from 'react';
import { IoChatbubblesOutline } from 'react-icons/io5';

const NoUserSelectedMessagePane = () => {
  return (
    <div className="noselecteduser">
      <div className="content">
        <IoChatbubblesOutline />
        <p className="echo">No user has been selected</p>
      </div>
    </div>
  );
};

export default NoUserSelectedMessagePane;
