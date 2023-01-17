import React, { useState } from 'react';
import Image from 'next/image';
import { IoMdChatboxes } from 'react-icons/io';
import { AiOutlineLineChart } from 'react-icons/ai';
import { FiSettings } from 'react-icons/fi';
import { BsBookmarks } from 'react-icons/bs';
import { RiCustomerService2Fill } from 'react-icons/ri';
import { HiOutlineUserGroup } from 'react-icons/hi';
import BookmarksOutlinedIcon from '@mui/icons-material/BookmarksOutlined';
import { useSession } from 'next-auth/react';
import type { RootState } from '../redux/store';
import { useSelector, useDispatch } from 'react-redux';
import { setMessageFlag, toggleTab } from '../redux/slices/general';

interface Props {
  isAdmin: boolean;
}

const Sidebar = (props: Props) => {
  const dispatch = useDispatch();
  const { data: session } = useSession();
  const profileImage = session?.user?.image || '/avatar.png';

  const { messageFlags, tab } = useSelector(
    (state: RootState) => state.general
  );

  const hasFlag = (tab: string) => {
    const flag = messageFlags.find((m: any) => m.type === tab);
    if (flag?.isNew) return true;
    return false;
  };

  const handleClick = (tabTag: string) => {
    dispatch(toggleTab(tabTag));
    dispatch(setMessageFlag({ type: tabTag, isNew: false }));
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
          <BsBookmarks />
        </span>
        <span
          className={
            tab === 'direct'
              ? `active ${hasFlag('direct') ? 'has-flag' : ''}`
              : ''
          }
          onClick={() => handleClick('direct')}
        >
          <IoMdChatboxes />
        </span>
        <span
          className={
            tab === 'group'
              ? `active ${hasFlag('group') ? 'has-flag' : ''}`
              : ''
          }
          onClick={() => handleClick('group')}
        >
          <HiOutlineUserGroup />
        </span>
        {props.isAdmin && (
          <span
            className={
              tab === 'service'
                ? `active ${hasFlag('service') ? 'has-flag' : ''}`
                : ''
            }
            onClick={() => handleClick('service')}
          >
            <RiCustomerService2Fill />
          </span>
        )}

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
