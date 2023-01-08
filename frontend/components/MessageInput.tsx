import React, {
  useEffect,
  useState,
  useRef,
  Dispatch,
  SetStateAction,
} from 'react';
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';
import EmojiIcon from '../assets/components/EmojiIcon';
import useTypingIndicator from '../hooks/useTypingIndicator';
import { useSocket } from './SocketProvider';
import SendIcon from '../assets/components/SendIcon';
import {
  IChatMessage,
  ICurrentCourse,
  IUser,
} from '../interfaces/channeltypes';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { useSession } from 'next-auth/react';

interface Props {
  isInIframe: boolean;
  setIsTyping: (e: undefined | boolean) => void;
  currentUser?: IUser;
  from?: string;
  currentCourse?: ICurrentCourse[];
  setMessages: Dispatch<SetStateAction<IChatMessage[]>>;
  messages: IChatMessage[];
  scrollTargetRef: React.MutableRefObject<HTMLDivElement>;
}
const MessageInput = (props: Props) => {
  const { isInIframe, setIsTyping } = props;
  const { data: session } = useSession();

  const [openEmoji, setOpenEmoji] = useState<boolean>(false);
  const inputRef = useRef<null | HTMLTextAreaElement>(null);
  const formRef = useRef<null | HTMLFormElement>(null);
  const [message, setMessage] = useState<string>('');
  const tab = useSelector((state: RootState) => state.general.tab);
  const { currentCourse } = props;

  const { isTyping, handleDown, handleUp } = useTypingIndicator();
  const { socket } = useSocket();

  const user = session?.user || {
    email: null,
    image: null,
    name: 'Guest',
  };

  useEffect(() => {
    setIsTyping(isTyping);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTyping]);

  const sendSocketMessage = () => {
    if (!socket) return;
    const { currentUser } = props;

    const courseId = currentCourse?.length
      ? currentCourse[0].chatcourseId
      : null;

    socket.emit('onSendMessage', {
      message,
      sender: user,
      receiver: {
        name: currentUser?.name,
        email: currentUser?.email,
        image: currentUser?.image,
        id: currentUser?.id,
      },
      isInIframe,
      from: props.from,
      type: props.from === 'serviceguest' ? 'service' : tab,
      courseId,
      createdAt: new Date(),
    });
    const formattedMessage: any = {
      message,
      sender: user,
      createdAt: new Date(),
    };
    props.setMessages([...props.messages, formattedMessage]);
    // props.scrollTargetRef.current.scrollTop =
    //   props.scrollTargetRef?.current?.scrollHeight + 1000;
    props.scrollTargetRef.current.scrollIntoView({ behavior: 'smooth' });

    setMessage('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    handleDown();
    if (!formRef?.current) return;
    if (e.key === 'Enter' && e.shiftKey === false) {
      e.preventDefault();
      sendSocketMessage();
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    sendSocketMessage();
  };

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className={`messageinput ${!isInIframe ? 'desktop-view' : 'iframe-view'}`}
    >
      {openEmoji && (
        <div className="emojipicker">
          <Picker data={data} onEmojiSelect={console.log} />
        </div>
      )}
      <EmojiIcon
        className="emojiopener"
        openEmoji={openEmoji}
        setOpenEmoji={setOpenEmoji}
      />
      <textarea
        className="input"
        ref={inputRef}
        onChange={e => setMessage(e.target.value)}
        value={message}
        onKeyUp={handleUp}
        onKeyDown={handleKeyDown}
        required
      />
      {!isInIframe && (
        <button aria-label="Send" className="send">
          <SendIcon />
        </button>
      )}
    </form>
  );
};

export default MessageInput;
