export interface IUser {
  ChannelUsers?: IChannelUsers;
  createdAt?: Date;
  email?: string;
  emailVerified?: string;
  id?: string;
  image?: string;
  name?: string;
  updatedAt?: Date;
  isGuest?: boolean;
  currentUser?: IUser;
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
  chatcourseId?: string;
  createdAt: string;
  title?: string;
  tags?: string;
  channelKey?: string;
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
  id: string;
  isRead: boolean;
  isDelivered: boolean;
  text: string;
  html: string;
  updatedAt: Date;
  createdAt: Date;
  chatcourseId: string;
  userId: string;
  chatcourse: ICurrentCourse;
  user: IUser;
  // message?: string;
  // sender?: ISocketUser;
  // receiver?: ISocketUser;
  // isInIframe?: boolean;
  // from?: string;
  // type: string;
  // courseId?: string;
  // createdAt?: Date;
}
