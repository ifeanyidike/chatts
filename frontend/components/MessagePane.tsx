import dynamic from 'next/dynamic';
import React, { useState } from 'react';
import MessageList from './MessageList';
// import MessagePaneHeader from './MessagePaneHeader';
// import MessageInput from './MessageInput';
export const MessagePaneHeader = dynamic(() => import('./MessagePaneHeader'), {
  ssr: false,
});
export const MessageInput = dynamic(() => import('./MessageInput'), {
  ssr: false,
});

const MesagePane = () => {
  const [isTyping, setIsTyping] = useState<undefined | boolean>(undefined);
  return (
    <div className="messagepane">
      <MessagePaneHeader />
      <MessageList isTyping={isTyping} isInIframe={false} />
      <MessageInput isInIframe={false} setIsTyping={setIsTyping} />
    </div>
  );
};

export default MesagePane;
