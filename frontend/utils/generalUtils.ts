import { IChatMessage } from '../interfaces/channeltypes';

export const getGuestMessages = (noAuthServiceMessages: any) => {
  if (Object.values(noAuthServiceMessages).length) {
    return noAuthServiceMessages;
  }
  const _guestMessages = localStorage.getItem('no-auth-messages');
  console.log({ _guestMessages });
  if (_guestMessages) return JSON.parse(_guestMessages);

  return {};
};

export const getMaxMessage = (messages?: IChatMessage[]) => {
  if (!messages?.length) return 'No communication yet';

  let character = messages[messages.length - 1].text;

  if (character?.length > 25) {
    character = character.substr(0, 25) + '...';
  }

  return character;
};
