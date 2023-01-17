/* eslint-disable react-hooks/exhaustive-deps */
import dynamic from 'next/dynamic';
import React, { useEffect, useState, useRef } from 'react';
import MessageList from './MessageList';
import useSWR, { useSWRConfig } from 'swr';
import useSWRMutation from 'swr/mutation';
import { RippleMultiLoader } from '../components/Loaders';
// import MessagePaneHeader from './MessagePaneHeader';
// import MessageInput from './MessageInput';
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

import { IChatMessage, IUser } from '../interfaces/channeltypes';
import { BASE, noAuthFetcher, noAuthPoster } from '../utils/appUtil';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import useHandleServiceReceivedMessage from '../hooks/useHandleServiceReceivedMessage';
import { getGuestMessages } from '../utils/generalUtils';

interface Props {
  users: IUser[];
  currentUser: IUser;
}

const MesagePane = (props: Props) => {
  const { data: session } = useSession();
  const user = session?.user;
  const { currentUser } = props;
  const [messages, setMessages] = useState<IChatMessage[]>([]);

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

  const course =
    activeTab === 'service'
      ? currentCourse
      : currentCourse?.length
      ? currentCourse[0]
      : null;

  const courseId = course ? course.chatcourseId || course.id : null;

  const { data, error } = useSWR(
    courseId ? `${BASE}/messages/${courseId}` : null,
    courseId ? noAuthFetcher : null
  );

  const noAuthServiceMessages = useHandleServiceReceivedMessage();

  useEffect(() => {
    if (currentUser?.isGuest || currentUser.name === 'Guest') {
      let guestMessages: any = getGuestMessages(noAuthServiceMessages);
      const addr = currentUser?.name || '';
      const _messages = guestMessages?.[addr] || [];
      setMessages(_messages);
    } else {
      setMessages(data || []);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, currentUser?.id, noAuthServiceMessages, activeTab]);

  useEffect(() => {
    if (!activeTab || !friendEmail || !user?.email || !query.key) return;

    if (activeTab === 'service' && !currentUser.name) return;

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
      ) : Object.keys(currentUser).length ? (
        <>
          <MessagePaneHeader currentUser={props.currentUser} />
          <MessageList
            currentUser={props.currentUser}
            isTyping={isTyping}
            isInIframe={false}
            currentCourse={currentCourse}
            setMessages={setMessages}
            messages={messages}
            scrollTargetRef={scrollTargetRef}
          />
          <MessageInput
            isInIframe={false}
            setIsTyping={setIsTyping}
            currentUser={props.currentUser}
            currentCourse={currentCourse}
            setMessages={setMessages}
            messages={messages}
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
