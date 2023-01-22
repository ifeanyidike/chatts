import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useSocket } from '../components/SocketProvider';
import { IChatMessage, IUser } from '../interfaces/channeltypes';
import { setMessageFlag } from '../redux/slices/general';
import { addMessage } from '../redux/slices/message';
import { RootState } from '../redux/store';

const useHandleMessages = (props: any) => {
  const { socket } = useSocket();
  const { courseId, isInIframe, user } = props;
  const dispatch = useDispatch();
  const tab = useSelector((state: RootState) => state.general.tab);

  useEffect(() => {
    if (!socket) return;

    const messageReceived = (data: any) => {
      // const courseId =
      //   course?.chatcourseId || course?.id || widgetUser?.chatcourseId;

      if (courseId !== data.chatcourseId) {
        return;
      }

      if (data.type !== tab && !isInIframe) {
        return;
      }

      if (tab !== 'group' && data?.user?.email !== user?.email) {
        dispatch(setMessageFlag({ type: tab, isNew: true }));
      }

      const formattedMessage: IChatMessage = data;

      dispatch(addMessage(formattedMessage));

      // props.messageListRef.current.scrollTop =
      //   props.messageListRef?.current?.scrollHeight;
      // props.scrollTargetRef.current.scrollIntoView({ behavior: 'smooth' });
      document
        ?.getElementById('chatts__scrollto__element')
        ?.scrollIntoView({ behavior: 'smooth' });
    };

    socket.on('onReceiveMessage', messageReceived);

    return () => {
      socket.off('onReceivedMessage', messageReceived);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket, courseId]);
};

export default useHandleMessages;
