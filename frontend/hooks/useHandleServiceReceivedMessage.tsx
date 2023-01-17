import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useSocket } from '../components/SocketProvider';
import { setMessageFlag } from '../redux/slices/general';
import { RootState } from '../redux/store';

const useHandleServiceReceivedMessage = () => {
  const { socket } = useSocket();
  const activeTab = useSelector((state: RootState) => state.general.tab);
  const dispatch = useDispatch();
  const [noAuthServiceMessages, setNoAuthServiceMessages] = useState<any>({});

  React.useEffect(() => {
    const isInService = window.location.pathname.includes('chat-widget');

    if (!socket || (!isInService && activeTab !== 'service')) return;

    socket.on('onReceiveServiceMessage', (data: any) => {
      const messages = { ...noAuthServiceMessages };
      if (!messages.hasOwnProperty(data.location)) {
        messages[data.location] = [];
      }
      const item = {
        user: data.sender,
        guestId: data.guestId,
        text: data.text,
        createdAt: data.createdAt,
      };
      const exists = messages[data.location].some(
        (m: any) => JSON.stringify(item) === JSON.stringify(m)
      );

      if (!exists) {
        messages[data.location].push(item);
      }
      dispatch(setMessageFlag({ type: 'service', isNew: true }));
      localStorage.setItem('no-auth-messages', JSON.stringify(messages));
      setNoAuthServiceMessages(messages);

      // if (course?.chatcourseId !== data.chatcourseId) {
      //   return;
      // }
      // const formattedMessage: IChatMessage = data;
      // setMessages([...messages, formattedMessage]);
      // // props.messageListRef.current.scrollTop =
      // //   props.messageListRef?.current?.scrollHeight;
      // props.scrollTargetRef.current.scrollIntoView({ behavior: 'smooth' });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket, activeTab, noAuthServiceMessages]);

  return noAuthServiceMessages;
};

export default useHandleServiceReceivedMessage;
