import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

export const Sidebar = dynamic(() => import('../../../components/Sidebar'), {
  ssr: false,
});

export const ChatBar = dynamic(() => import('../../../components/ChatBar'), {
  ssr: false,
});
import { BASE, noAuthPutter } from '../../../utils/appUtil';
import { Inter } from '@next/font/google';
import MesagePane from '../../../components/MessagePane';
import Header from '../../../components/Header';
import {
  IUserChannels,
  IUser,
  ICurrentCourse,
} from '../../../interfaces/channeltypes';
import ProtectedRoute from '../../protected';
import { useSession } from 'next-auth/react';
import { useSocket } from '../../../components/SocketProvider';
import { useRouter } from 'next/router';
import useSWRMutation from 'swr/mutation';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';

const inter = Inter({ subsets: ['latin'] });

interface Props {
  channel: IUserChannels;
}

const ChatView = (props: Props) => {
  const users: IUser[] = props.channel.users;
  const courses: ICurrentCourse[] = props.channel.chatcourses || [];

  const { data: session } = useSession({ required: false });
  const { socket } = useSocket();
  const router = useRouter();
  const { query } = router;
  const { key } = query;
  const tab = useSelector((state: RootState) => state.general.tab);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    const creator = props.channel.createdBy;
    const authEmail = session?.user?.email;
    if (!users || !creator || !authEmail) return;

    const adminUser = users.find(user => user.id === creator);
    if (adminUser?.email === authEmail) setIsAdmin(true);
  }, [users, session, props.channel.createdBy]);

  const { data, trigger } = useSWRMutation(
    key ? `${BASE}/channels/${key}` : null,
    noAuthPutter
  );

  useEffect(() => {
    if (!session?.user?.email || !key || !socket) return;
    socket.auth = { user: session.user, channel: key };

    socket.connect();
  }, [socket, session, key]);

  useEffect(() => {
    const userEmail = session?.user?.email;
    if (!userEmail || !key || tab === 'service') return;

    const isUserInChannel = users?.some(user => user.email === userEmail);

    if (!isUserInChannel) {
      (async () => {
        await trigger({ data: { userEmail } });
      })();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, key, users, tab]);

  return (
    <div className={`chatview ${inter.className}`}>
      <ProtectedRoute>
        <>
          <Sidebar isAdmin={isAdmin} />
          <ChatBar users={users} courses={courses} />
          <MesagePane users={users} />
        </>
      </ProtectedRoute>
    </div>
  );
};

export default ChatView;

// export const getServerSideProps = async () => {
//   const res = await fetch(`${BASE}/channels`);
//   const channels = await res.json();

//   return {
//     paths: channels.map((c: any) => {
//       return {
//         params: {
//           key: c.key,
//         },
//       };
//     }),
//     fallback: false,
//   };
// };

export const getStaticPaths = async () => {
  const res = await fetch(`${BASE}/channels`);
  const channels = await res.json();

  return {
    paths: channels.map((c: any) => {
      return {
        params: {
          key: c.key,
        },
      };
    }),
    fallback: false,
  };
};

export const getStaticProps = async (context: any) => {
  const res = await fetch(`${BASE}/channels/${context.params.key}`);
  const channel = await res.json();
  return {
    props: {
      channel,
    },
  };
};
