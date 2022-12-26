import React from 'react';

interface Props {
  className: string;
  openEmoji: boolean;
  setOpenEmoji: React.Dispatch<React.SetStateAction<boolean>>;
}
const EmojiIcon = (props: Props) => {
  const { className, openEmoji, setOpenEmoji } = props;

  const handleClick = () => {
    setOpenEmoji(!openEmoji);
  };
  return (
    <svg
      className={className}
      height="28"
      width="28"
      xmlns="http://www.w3.org/2000/svg"
      onClick={handleClick}
    >
      <title>Open emoji picker</title>
      <g clipRule="evenodd" fillRule="evenodd">
        <path d="M14 4.4C8.6 4.4 4.4 8.6 4.4 14c0 5.4 4.2 9.6 9.6 9.6c5.4 0 9.6-4.2 9.6-9.6c0-5.4-4.2-9.6-9.6-9.6zM2 14c0-6.6 5.4-12 12-12s12 5.4 12 12s-5.4 12-12 12s-12-5.4-12-12zM12.8 11c0 1-.8 1.8-1.8 1.8s-1.8-.8-1.8-1.8s.8-1.8 1.8-1.8s1.8.8 1.8 1.8zM18.8 11c0 1-.8 1.8-1.8 1.8s-1.8-.8-1.8-1.8s.8-1.8 1.8-1.8s1.8.8 1.8 1.8zM8.6 15.4c.6-.4 1.2-.2 1.6.2c.6.8 1.6 1.8 3 2c1.2.4 2.8.2 4.8-2c.4-.4 1.2-.6 1.6 0c.4.4.6 1.2 0 1.6c-2.2 2.6-4.8 3.4-7 3c-2-.4-3.6-1.8-4.4-3c-.4-.6-.2-1.2.4-1.8z"></path>
      </g>
    </svg>
  );
};

export default EmojiIcon;
