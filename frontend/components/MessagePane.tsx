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
  // const { data, error } = useSWR(
  //   activeTab ? `${BASE}/chatcourse` : null,
  //   activeTab ? () => noAuthPoster : null
  // );

  const { data: currentCourse, trigger } = useSWRMutation(
    activeTab ? `${BASE}/chatcourse` : null,
    noAuthPoster
  );

  const course = currentCourse?.length ? currentCourse[0] : null;

  const { data, error } = useSWR(
    course?.chatcourseId ? `${BASE}/messages/${course.chatcourseId}` : null,
    course?.chatcourseId ? noAuthFetcher : null
  );

  useEffect(() => {
    setMessages(data || []);
  }, [data]);

  useEffect(() => {
    if (!activeTab || !currentUser?.email || !user?.email || !query.key) return;
    (async () => {
      setLoading(true);

      const members = [currentUser.email, user.email];
      await trigger({ data: { activeTab, members, channelKey: query.key } });
      setLoading(false);
    })();
  }, [activeTab, currentUser?.email, user?.email, trigger, query.key]);

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
