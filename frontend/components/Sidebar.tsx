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
import type { RootState } from '../redux/store';
import { useSelector, useDispatch } from 'react-redux';
import { toggleTab } from '../redux/slices/general';

const Sidebar = () => {
  const dispatch = useDispatch();
  const { data: session } = useSession();
  const profileImage = session?.user?.image || '/avatar.png';

  const tab = useSelector((state: RootState) => state.general.tab);

  const handleClick = (tabTag: string) => {
    dispatch(toggleTab(tabTag));
  };

  return (
    <div className="sidebar">
      <div className="profile-image">
        <Image src={profileImage} width="35" height="35" alt="Avatar" />
      </div>

      <div className="sidebar__menu">
        <span
          className={tab === 'bookmarks' ? 'active' : ''}
          onClick={() => handleClick('bookmarks')}
        >
          {/* <BookmarksOutlinedIcon /> */}
          <IoBookmarksOutline />
        </span>
        <span
          className={tab === 'direct' ? 'active' : ''}
          onClick={() => handleClick('direct')}
        >
          <IoMdChatboxes />
        </span>
        <span
          className={tab === 'group' ? 'active' : ''}
          onClick={() => handleClick('group')}
        >
          <HiOutlineUserGroup />
        </span>
        <span
          className={tab === 'service' ? 'active' : ''}
          onClick={() => handleClick('service')}
        >
          <RiCustomerService2Fill />
        </span>
        <span
          className={tab === 'chart' ? 'active' : ''}
          onClick={() => handleClick('chart')}
        >
          <AiOutlineLineChart />
        </span>
        <span
          className={tab === 'settings' ? 'active' : ''}
          onClick={() => handleClick('settings')}
        >
          <FiSettings />
        </span>
      </div>
    </div>
  );
};

export default Sidebar;
