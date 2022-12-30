import React from 'react';
import Image from 'next/image';
import { IoMdChatboxes } from 'react-icons/io';
import { AiOutlineLineChart } from 'react-icons/ai';
import { FiSettings } from 'react-icons/fi';
import { IoBookmarksOutline } from 'react-icons/all';
import { RiCustomerService2Fill } from 'react-icons/ri';
import { HiOutlineUserGroup } from 'react-icons/hi';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="profile-image">
        <Image src="/avatar.png" width="35" height="35" alt="Avatar" />
      </div>

      <div className="sidebar__menu">
        <span>
          <IoBookmarksOutline />
        </span>
        <span>
          <IoMdChatboxes />
        </span>
        <span>
          <HiOutlineUserGroup />
        </span>
        <span>
          <RiCustomerService2Fill />
        </span>
        <span>
          <AiOutlineLineChart />
        </span>
        <span>
          <FiSettings />
        </span>
      </div>
    </div>
  );
};

export default Sidebar;
