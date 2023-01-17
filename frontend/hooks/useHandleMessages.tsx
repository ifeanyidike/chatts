import React, { useState, useEffect } from 'react';
import { IChatMessage, IUser } from '../interfaces/channeltypes';
import { getGuestMessages } from '../utils/generalUtils';
import useHandleServiceReceivedMessage from './useHandleServiceReceivedMessage';

interface Props {
  currentUser?: IUser;
  data?: any;
}
const useHandleMessages = (props: Props) => {
  const [messages, setMessages] = useState<IChatMessage[]>([]);
  const { currentUser, data } = props;

  const noAuthServiceMessages = useHandleServiceReceivedMessage();

  useEffect(() => {
    if (!currentUser?.id) return;
    console.log({ currentUser, data });
    // if (currentUser?.isGuest || currentUser.name === 'Guest') {
    //   let guestMessages: any = getGuestMessages(noAuthServiceMessages);
    //   const addr = currentUser?.name || '';
    //   const _messages = guestMessages?.[addr] || [];
    //   setMessages(_messages);
    // }

    // if (currentUser?.isGuest || currentUser.name === 'Guest') {
    //   let guestMessages: any = getGuestMessages(noAuthServiceMessages);
    //   const addr = currentUser?.name || '';
    //   const _messages = guestMessages?.[addr] || [];
    //   setMessages(_messages);
    // } else {
    //   setMessages(data || []);
    // }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);
  return { messages, setMessages };
};

export default useHandleMessages;
