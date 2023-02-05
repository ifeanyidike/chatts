import dynamic from 'next/dynamic';
import React, { useEffect, useState, useRef } from 'react';
import MessageList from './MessageList';
import useSWR, { useSWRConfig } from 'swr';
import useSWRMutation from 'swr/mutation';
import { RippleMultiLoader } from '../components/Loaders';
export const MessagePaneHeader = dynamic(() => import('./MessagePaneHeader'), {
  ssr: false,
});
export const MessageInput = dynamic(() => import('./MessageInput'), {
  ssr: false,
});

export const NoUserSelectedMessagePane = dynamic(
  () => import('./NoUserSelectedMessagePane'),
  { ssr: false }
);

import { ICurrentCourse, IUser } from '../interfaces/channeltypes';
import { BASE, noAuthFetcher, noAuthPoster } from '../utils/appUtil';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import useHandleServiceReceivedMessage from '../hooks/useHandleServiceReceivedMessage';
import { getGuestMessages } from '../utils/generalUtils';
import { setMessages } from '../redux/slices/message';
import { setSelectedCourse } from '../redux/slices/course';

interface Props {
  users: IUser[];
}

const MesagePane = (props: Props) => {
  const { data: session } = useSession();
  const user = session?.user;
  const dispatch = useDispatch();

  const { currentUser } = useSelector((state: RootState) => state.user);
  const { selectedCourse } = useSelector((state: RootState) => state.course);

  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState<undefined | boolean>(undefined);
  const activeTab = useSelector((state: RootState) => state.general.tab);
  const { query } = useRouter();
  const scrollTargetRef = useRef() as React.MutableRefObject<HTMLDivElement>;
  const friendEmail = currentUser?.email || currentUser?.currentUser?.email;

  const { data: currentCourse, trigger } = useSWRMutation(
    activeTab ? `${BASE}/chatcourse` : null,
    noAuthPoster
  );
  const { courses } = useSelector((state: RootState) => state.course);

  const course =
    activeTab === 'group'
      ? selectedCourse
      : activeTab === 'service'
      ? currentCourse
      : currentCourse?.length
      ? currentCourse[0]
      : null;

  const courseId = course ? course.chatcourseId || course.id : null;

  // const { data, error } = useSWR(
  //   courseId ? `${BASE}/messages/${courseId}` : null,
  //   courseId ? noAuthFetcher : null
  // );

  const noAuthServiceMessages = useHandleServiceReceivedMessage();

  useEffect(() => {
    if (activeTab === 'group') return;
    if (activeTab === 'service' && currentCourse && !currentCourse.length) {
      dispatch(setSelectedCourse(currentCourse));
    } else if (activeTab === 'direct' && currentCourse?.length) {
      const course = currentCourse[0];
      const selectedCourse = {
        id: course.chatcourseId,
        createdAt: course.createdAt,
        updatedAt: course.updatedAt,
        userId: course.userId,
      };
      dispatch(setSelectedCourse(selectedCourse));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, currentCourse]);

  useEffect(() => {
    if (currentUser?.isGuest || currentUser?.name === 'Guest') {
      let guestMessages: any = getGuestMessages(noAuthServiceMessages);
      const addr = currentUser?.name || '';
      const _messages = guestMessages?.[addr] || [];

      dispatch(setMessages(_messages));
    } else {
      const course = courses.find((c: ICurrentCourse) => c.id === courseId);
      dispatch(setMessages(course?.messages || []));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser, noAuthServiceMessages, activeTab, courses, courseId]);

  useEffect(() => {
    if (!activeTab || !friendEmail || !user?.email || !query.key) return;

    if (activeTab !== 'direct' && !currentUser.name) return;

    (async () => {
      setLoading(true);
      const members = [friendEmail, user.email];
      const name = currentUser.name;

      await trigger({
        data: { activeTab, members, channelKey: query.key, name },
      });
      setLoading(false);
    })();
  }, [activeTab, friendEmail, user?.email, trigger, query.key, currentUser]);

  return (
    <div className="messagepane">
      {loading ? (
        <RippleMultiLoader />
      ) : (currentUser && Object.keys(currentUser).length) ||
        (selectedCourse && Object.keys(selectedCourse).length) ? (
        <>
          <MessagePaneHeader activeTab={activeTab} />
          <MessageList
            isTyping={isTyping}
            isInIframe={false}
            currentCourse={currentCourse}
            scrollTargetRef={scrollTargetRef}
          />
          <MessageInput
            isInIframe={false}
            setIsTyping={setIsTyping}
            currentCourse={currentCourse}
            scrollTargetRef={scrollTargetRef}
          />
        </>
      ) : (
        <NoUserSelectedMessagePane />
      )}
    </div>
  );
};

export default MesagePane;
