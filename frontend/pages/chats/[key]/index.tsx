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
import { IUserChannels, IUser } from '../../../interfaces/channeltypes';
import ProtectedRoute from '../../protected';
import { useSession } from 'next-auth/react';
import { useSocket } from '../../../components/SocketProvider';
import { useRouter } from 'next/router';
import useSWRMutation from 'swr/mutation';
import axios from 'axios';

const inter = Inter({ subsets: ['latin'] });

interface Props {
  channel: IUserChannels;
}

const ChatView = (props: Props) => {
  const users: IUser[] = props.channel.users;
  const [currentUser, setCurrentUser] = useState<IUser>({});
  const { data: session } = useSession({ required: false });
  const { socket } = useSocket();
  const router = useRouter();
  const { query } = router;
  const { key } = query;

  const { trigger } = useSWRMutation(
    key ? `${BASE}/channels/${key}` : null,
    noAuthPutter
  );

  useEffect(() => {
    if (!session?.user?.email || !key || !socket) return;
    socket.auth = { user: session.user, channel: key };

    socket.connect();
    console.log(socket);
  }, [socket, session, key]);

  useEffect(() => {
    const userEmail = session?.user?.email;
    if (!userEmail || !key) return;

    const isUserInChannel = users?.some(user => user.email === userEmail);

    if (!isUserInChannel) {
      (async () => {
        await trigger({ data: { userEmail } });
      })();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, key, users]);

  //  useEffect(() => {
  //    if (!activeTab || !currentUser?.email || !user?.email || !query.key)
  //      return;
  //    (async () => {
  //      setLoading(true);

  //      const members = [currentUser.email, user.email];
  //      await trigger({ data: { activeTab, members, channelKey: query.key } });
  //      setLoading(false);
  //    })();
  //  }, [activeTab, currentUser?.email, user?.email, trigger, query.key]);

  return (
    <div className={`chatview ${inter.className}`}>
      <ProtectedRoute>
        <>
          <Sidebar />
          <ChatBar
            users={users}
            setCurrentUser={setCurrentUser}
            currentUser={currentUser}
          />
          <MesagePane users={users} currentUser={currentUser} />
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
  console.log(channel.users);
  return {
    props: {
      channel,
    },
  };
};
