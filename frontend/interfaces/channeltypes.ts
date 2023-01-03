export interface IUser {
  ChannelUsers?: IChannelUsers;
  createdAt?: string;
  email?: string;
  emailVerified?: string;
  id?: string;
  image?: string;
  name?: string;
  updatedAt?: string;
}

export interface IChannelUsers {
  channelKey: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export interface IUserChannels {
  createdBy: string;
  id: string;
  key: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  users: IUser[];
}
