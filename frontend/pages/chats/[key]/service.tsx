import React from 'react';
import { BASE } from '../../../utils/appUtil';

const service = () => {
  return <div>service</div>;
};

export default service;
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
