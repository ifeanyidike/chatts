import React, { useState } from 'react';
import dynamic from 'next/dynamic';

export const Sidebar = dynamic(() => import('../../../components/Sidebar'), {
  ssr: false,
});

export const ChatBar = dynamic(() => import('../../../components/ChatBar'), {
  ssr: false,
});
import { BASE } from '../../../utils/appUtil';
import { Inter } from '@next/font/google';
import MesagePane from '../../../components/MessagePane';
import Header from '../../../components/Header';
import { IUserChannels, IUser } from '../../../interfaces/channeltypes';

const inter = Inter({ subsets: ['latin'] });

interface Props {
  channel: IUserChannels;
}

const ChatView = (props: Props) => {
  const [activeTab, setActiveTab] = useState('direct');
  const users: IUser[] = props.channel.users;
  const [currentUser, setCurrentUser] = useState<IUser>({});

  return (
    <div className={`chatview ${inter.className}`}>
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <ChatBar
        activeTab={activeTab}
        users={users}
        setCurrentUser={setCurrentUser}
        currentUser={currentUser}
      />
      <MesagePane
        activeTab={activeTab}
        users={users}
        currentUser={currentUser}
      />
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
