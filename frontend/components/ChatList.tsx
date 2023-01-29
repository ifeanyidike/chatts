import React, { useEffect, useState } from 'react';
import { FiSettings } from 'react-icons/fi';
import { useRouter } from 'next/router';
import ChatItem from './ChatItem';
import { ICurrentCourse, IUser } from '../interfaces/channeltypes';
import { useSession } from 'next-auth/react';
import { useSocket } from './SocketProvider';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentUser } from '../redux/slices/user';
import { setSelectedCourse } from '../redux/slices/course';
import { RootState } from '../redux/store';
import { IoMdAddCircleOutline } from 'react-icons/io';

interface Props {
  activeTab: string;
  users: IUser[];
  courses: ICurrentCourse[];
}

interface ChannelTypeUsers {
  Guests?: any;
  authUsers?: IUser[];
}

interface HandleSubmit {
  user?: IUser;
  course?: ICurrentCourse;
}

const ChatList = (props: Props) => {
  const dispatch = useDispatch();

  const { currentUser } = useSelector((state: RootState) => state.user);
  const { selectedCourse } = useSelector((state: RootState) => state.course);

  const { data: session } = useSession();
  const { onlineUsers } = useSocket();
  const { users, activeTab } = props;
  const [hasGuests, setHasGuests] = useState<boolean>(false);
  const { query } = useRouter();
  const courses = props.courses;
  const { key } = query;

  const [channelTypeUsers, setChannelTypeUsers] = useState<ChannelTypeUsers>({
    Guests: [],
    authUsers: [],
  });

  const [groupCourses, setGroupCourses] = useState<ICurrentCourse[]>([]);

  useEffect(() => {
    if (courses && activeTab === 'group') {
      const _groupCourses = courses?.filter(
        (course: any) => course.type === activeTab
      );
      setGroupCourses(_groupCourses);
    }
  }, [courses, activeTab]);

  useEffect(() => {
    if (activeTab === 'service') {
      let msg = localStorage.getItem('no-auth-messages');
      let _messages = msg ? JSON.parse(msg) : {};

      const channelUsers = Object.keys(_messages || []);
      const guests = channelUsers?.map((channel: any) => {
        const addr = _messages?.[channel];

        // const message = addr?.find((u: any) => !u.user.email && u.user.id);
        return {
          name: channel,
          id: addr[0].guestId,
        };
      });

      const authUsers = courses
        ?.filter((course: any) => course.type === activeTab)
        .map((c: any) => {
          const currentUser = c.users.find(
            (u: any) => u.email !== session?.user?.email
          );
          return {
            name: c.title,
            tags: c.tags,
            id: currentUser.id,
            currentUser,
          };
        });
      const hasGuests = !!guests.length;
      setHasGuests(hasGuests);

      setChannelTypeUsers({
        Guests: guests,
        authUsers,
      });
    } else {
      const _users =
        users.filter((user: any) => user.email !== session?.user?.email) || [];
      setChannelTypeUsers({
        authUsers: _users,
      });
    }
  }, [users, activeTab, session, courses]);

  const handleClick = (_props: HandleSubmit) => {
    const { user, course } = _props;

    if (course?.isEditable) return;

    if (user && activeTab !== 'group') {
      dispatch(setCurrentUser(user));
      // props.setCurrentUser(user);
    }
    if (course) {
      dispatch(setSelectedCourse(course));
      // props.setSelectedCourse(course);
    }
  };

  const handleAddGroupCourse = async () => {
    const courseToAdd = {
      channelKey: key?.toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
      isDefault: false,
      id: crypto.randomUUID(),
      title: 'Changes Required',
      type: 'group',
      isEditable: true,
    };
    setGroupCourses([...groupCourses, courseToAdd]);
  };

  return (
    <div className="chatlist">
      <div className="chatlist__header">
        <b>Message</b>
        <div className="chatlist__settings__container">
          <span className="chatlist__header__settings">
            <FiSettings />
          </span>
          {activeTab === 'group' && (
            <span
              className="chatlist__header__settings"
              onClick={handleAddGroupCourse}
            >
              <IoMdAddCircleOutline />
            </span>
          )}
        </div>
      </div>

      {activeTab === 'group'
        ? groupCourses.map((course: any) => (
            <ChatItem
              key={course.id}
              isSelected={selectedCourse?.id === course.id}
              handleClick={() => handleClick({ course })}
              course={course}
              activeTab={activeTab}
              setGroupCourses={setGroupCourses}
              groupCourses={groupCourses}
            />
          ))
        : Object.entries(channelTypeUsers).map(([tag, users]) => {
            const isGuest = tag === 'Guests';
            const hasUsers = tag !== 'Guests' && users.length;
            return (
              <React.Fragment key={tag}>
                {hasGuests && isGuest ? (
                  <h4 className="chatlist__users__header">{tag}</h4>
                ) : hasUsers ? (
                  <h4 className="chatlist__users__header">Users</h4>
                ) : null}
                {users?.map((user: any, index: number) => (
                  <ChatItem
                    key={user.id || index}
                    isSelected={currentUser?.id === user.id}
                    handleClick={() =>
                      handleClick({ user: { ...user, isGuest } })
                    }
                    isOnline={onlineUsers.some(
                      (_user: IUser) =>
                        _user.email === user.email ||
                        _user.email === user.currentUser?.email
                    )}
                    user={{ ...user, isGuest }}
                    activeTab={activeTab}
                  />
                ))}
              </React.Fragment>
            );
          })}
    </div>
  );
};

export default ChatList;
