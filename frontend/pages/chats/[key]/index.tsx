import React from 'react';
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

const inter = Inter({ subsets: ['latin'] });
const ChatView = (props: any) => {
  console.log({ props });
  return (
    <div className={`chatview ${inter.className}`}>
      <Sidebar />
      <ChatBar />
      <MesagePane />
    </div>
  );
};

export default ChatView;

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

export const getStaticProps = (context: any) => {
  return {
    props: {
      channel: context.params.key,
    },
  };
};
