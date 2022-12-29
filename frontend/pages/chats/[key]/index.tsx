import React from 'react';
import dynamic from 'next/dynamic';

export const Sidebar = dynamic(() => import('../../../components/Sidebar'), {
  ssr: false,
});
import { BASE } from '../../../utils/appUtil';

const ServiceAdmin = (props: any) => {
  console.log({ props });
  return (
    <div>
      <Sidebar />
    </div>
  );
};

export default ServiceAdmin;

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
