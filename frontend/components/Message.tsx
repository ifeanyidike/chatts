import { useSession } from 'next-auth/react';
import Image from 'next/image';
import React, { useState } from 'react';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import ClickOutside from '../components/ClickOutside';
import { IChatMessage, IUser } from '../interfaces/channeltypes';

interface Props {
  data: IChatMessage;
  widgetUser: IUser;
}

const Message = (props: Props) => {
  const { data } = props;
  const formatTime = (d: Date) => {
    var h = d.getHours();
    return (
      (h % 12 || 12) +
      ':' +
      d.getMinutes().toString().padStart(2, '0') +
      ' ' +
      (h < 12 ? 'A' : 'P') +
      'M'
    );
  };

  const formattedDateTime = (dateTime: Date) => {
    const today = new Date();
    const targetDate = new Date(dateTime);
    if (today.toLocaleDateString() === targetDate.toLocaleDateString()) {
      return 'Today at ' + formatTime(targetDate);
    }
    return new Date(dateTime).toLocaleDateString();
  };

  const [messageOptions, toggleMessageOptions] = useState<boolean>(false);
  const { data: session } = useSession();

  const user = session?.user ||
    props.widgetUser || {
      email: undefined,
      image: undefined,
      name: 'Guest',
    };
  const userImage = data?.user?.image || '/avatar.png';
  const currentTime = data.createdAt;

  return (
    <div
      className={`message ${
        data.user?.email === user?.email ? 'own-message' : ''
      }`}
    >
      <div className="message__content">
        <MessageItemImage userImage={userImage} />

        <p className="message__text">{data.text}</p>
        {!messageOptions && (
          <MoreHorizIcon
            className="message__more message__more__others"
            onClick={() => toggleMessageOptions(true)}
          />
        )}

        {messageOptions && (
          <ClickOutside handleClick={() => toggleMessageOptions(false)}>
            <>
              <MoreHorizIcon
                className="message__more__others"
                onClick={() => toggleMessageOptions(!messageOptions)}
              />
              <div className="message__options">
                <span>Edit Message</span>
                <span>Delete</span>
                <span>Reply</span>
              </div>
            </>
          </ClickOutside>
        )}
      </div>
      <small className="message__time">
        {currentTime ? formattedDateTime(currentTime) : null}
      </small>
    </div>
  );
};

const MessageItemImage = ({ userImage }: any) => {
  const [failedToLoad, setFailedToLoad] = useState<boolean>(false);
  const image: string = failedToLoad ? '/avatar.png' : userImage;
  return (
    <div className="message__image">
      <Image
        src={image}
        alt="User"
        width="29"
        height="29"
        onError={() => setFailedToLoad(true)}
      />
    </div>
  );
};

export default Message;
