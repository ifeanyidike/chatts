import React, { useState } from 'react';
import Image from 'next/image';
import { IoMdChatboxes } from 'react-icons/io';
import { AiOutlineLineChart } from 'react-icons/ai';
import { FiSettings } from 'react-icons/fi';
import { IoBookmarksOutline } from 'react-icons/all';
import { RiCustomerService2Fill } from 'react-icons/ri';
import { HiOutlineUserGroup } from 'react-icons/hi';
import BookmarksOutlinedIcon from '@mui/icons-material/BookmarksOutlined';
import { useSession } from 'next-auth/react';

interface Props {
  activeTab: string;
  setActiveTab: (e: string) => void;
}

const Sidebar = (props: Props) => {
  const { data: session } = useSession();
  const { activeTab, setActiveTab } = props;
  const profileImage = session?.user?.image || '/avatar.png';

  const handleClick = (tabTag: string) => {
    setActiveTab(tabTag);
  };
  return (
    <div className="sidebar">
      <div className="profile-image">
        <Image src={profileImage} width="35" height="35" alt="Avatar" />
      </div>

      <div className="sidebar__menu">
        <span
          className={activeTab === 'bookmarks' ? 'active' : ''}
          onClick={() => handleClick('bookmarks')}
        >
          {/* <BookmarksOutlinedIcon /> */}
          <IoBookmarksOutline />
        </span>
        <span
          className={activeTab === 'direct' ? 'active' : ''}
          onClick={() => handleClick('direct')}
        >
          <IoMdChatboxes />
        </span>
        <span
          className={activeTab === 'group' ? 'active' : ''}
          onClick={() => handleClick('group')}
        >
          <HiOutlineUserGroup />
        </span>
        <span
          className={activeTab === 'service' ? 'active' : ''}
          onClick={() => handleClick('service')}
        >
          <RiCustomerService2Fill />
        </span>
        <span
          className={activeTab === 'chart' ? 'active' : ''}
          onClick={() => handleClick('chart')}
        >
          <AiOutlineLineChart />
        </span>
        <span
          className={activeTab === 'settings' ? 'active' : ''}
          onClick={() => handleClick('settings')}
        >
          <FiSettings />
        </span>
      </div>
    </div>
  );
};

export default Sidebar;
