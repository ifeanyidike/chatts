import { useState, useCallback, useEffect } from 'react';

const useTypingIndicator = (
  inputRef: React.MutableRefObject<HTMLTextAreaElement | null>
): undefined | boolean => {
  const [isTyping, setIsTyping] = useState<undefined | boolean>();
  const [typingTimeout, setTypingTimeout] = useState<null | NodeJS.Timeout>(
    null
  );

  const handleKeyDown = useCallback(() => {
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }
    setIsTyping(true);
    setTypingTimeout(setTimeout(() => setIsTyping(false), 2500));
  }, [typingTimeout]);

  const handleKeyUp = useCallback(() => {
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }
    setTypingTimeout(setTimeout(() => setIsTyping(false), 2500));
  }, [typingTimeout]);

  useEffect(() => {
    let currentRef = inputRef?.current;
    if (!currentRef) return;

    currentRef.addEventListener('keydown', handleKeyDown);
    currentRef.addEventListener('keyup', handleKeyUp);

    return () => {
      currentRef?.removeEventListener('keydown', handleKeyDown);
      currentRef?.removeEventListener('keyup', handleKeyUp);
    };
  }, [inputRef, handleKeyDown, handleKeyUp, typingTimeout]);
  return isTyping;
};

export default useTypingIndicator;
