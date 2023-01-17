export const getGuestMessages = (noAuthServiceMessages: any) => {
  if (Object.values(noAuthServiceMessages).length) {
    return noAuthServiceMessages;
  }
  const _guestMessages = localStorage.getItem('no-auth-messages');
  console.log({ _guestMessages });
  if (_guestMessages) return JSON.parse(_guestMessages);

  return {};
};
