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

export interface ICurrentCourse {
  chatcourseId: string;
  createdAt: string;
  id: string;
  updatedAt: string;
  userId: string;
}

export interface ISocketUser {
  name?: string;
  email?: string;
  image?: string;
}

export interface IChatMessage {
  message?: string;
  sender?: ISocketUser;
  // receiver?: ISocketUser;
  // isInIframe?: boolean;
  // from?: string;
  // type: string;
  // courseId?: string;
  createdAt?: Date;
}
