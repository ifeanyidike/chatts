import { Express } from 'express';
import { Server as SocketServer, Socket } from 'socket.io';
import { IncomingMessage, ServerResponse, Server as HttpServer } from 'http';
import User from '../models/User';
import Message from '../models/Message';
import ChatCourse from '../models/chatcourse';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';

//  io.of(/\w*([\W\w])/g).on('connection', socket => {
//     const namespaceSocket = socket.nsp;
//     const namespace = namespaceSocket.name.substring(1);

interface IUser {
  id?: string;
  name: string;
  email: string;
  image: string;
}

interface IMessageData {
  message: string;
  sender: IUser;
  receiver?: IUser;
  isInIframe?: boolean;
  from?: string;
  type: string;
  courseId?: string;
  createdAt: Date;
}

const initializeSocket = (
  httpServer: HttpServer<typeof IncomingMessage, typeof ServerResponse>,
  app: Express
) => {
  const io = new SocketServer(httpServer, {
    cors: {
      origin: ['http://localhost:3000'],
      allowedHeaders: ['my-custom-header'],
      credentials: true,
    },
  });

  app.use((req: any, res: any, next: Function) => {
    req.io = io;
    return next();
  });

  io.use((socket: any, next) => {
    const { user, channel, isCustomer, location } = socket.handshake.auth;

    if (!user.email && user.name !== 'Guest') {
      return next(new Error('invalid user'));
    }

    if (isCustomer) {
      socket.location = location;
    }

    socket.user = user;
    socket.userEmail = user.email;
    socket.channel = channel;
    socket.isGuest = user.name === 'Guest';
    socket.isCustomer = isCustomer;
    return next();
  });

  let onlineUsers: any = {};

  io.on('connection', async (socket: any) => {
    const channelId = socket.channel;

    socket.join(socket.channel);

    if (!onlineUsers.hasOwnProperty(channelId)) {
      onlineUsers[channelId] = [];
    }

    const userExists = onlineUsers[channelId].some(
      (user: any) => user.email === socket.userEmail
    );

    if (!userExists) {
      onlineUsers[channelId] = [
        ...onlineUsers[channelId],
        {
          ...socket.handshake.auth.user,
        },
      ];
    }

    // for (let [id, s] of io.of('/').sockets) {
    //   const socketValue: any = s;
    //   const channelId: string = socketValue.channel;
    //   if (!onlineUsers.hasOwnProperty(channelId)) {
    //     onlineUsers[channelId] = [];
    //   }

    //   const userExists = onlineUsers[channelId].some(
    //     (user: any) => user.email === socketValue.userEmail
    //   );

    //   if (!userExists) {
    //     onlineUsers[channelId] = [
    //       ...onlineUsers[channelId],
    //       {
    //         ...s.handshake.auth.user,
    //       },
    //     ];
    //   }

    //   // onlineUsers.push({
    //   //   socketId: id,
    //   //   ...s.handshake.auth,
    //   // });
    //   // console.log({ id }, s.handshake.auth);
    // }

    // const socketKinds = io.in(socket.channel);
    // const socketUsers = await socketKinds.fetchSockets();
    // console.log({
    //   socketKinds,
    //   socketUsers,
    // });

    io.to(socket.channel).emit('connected_users', onlineUsers[socket.channel]);

    // io.of(`/${socket.channel}`).emit(
    //   'connected_users',
    //   onlineUsers[socket.channel]
    // );

    // socket.broadcast.emit('connected_users', onlineUsers);
    // console.log(onlineUsers, socket.userEmail);
    // const matchingSockets = await io.allSockets();
    // const matchingSockets2 = await io.fetchSockets();
    // const matchingUserSockets = await io.in(socket.userEmail).fetchSockets();
    // const matchingUserSockets2 = matchingSockets2.filter(
    //   (e: any) =>
    //     e.handshake.auth.user.email === socket.handshake.auth.user.email
    // );
    // console.log('matching sockets on disconnect', {
    //   matchingSockets,
    //   matchingSockets2,
    //   matchingUserSockets2,
    //   matchingUserSockets,
    // });

    socket.on('onSendMessage', async (data: IMessageData) => {
      console.log({ data }, socket);
      // message,
      // senderEmail: user?.email,
      // receiverEmail: props.currentUser?.email,
      // isInIframe,
      // from: props.from,
      // type: props.from === 'serviceguest' ? 'service' : tab,
      // courseId,

      // io.to(channelId).emit('onReceiveMessage', outputData);
      // const newUser = await User.create({
      //   firstName: 'Ifeanyi',
      //   lastName: 'Dike',
      //   email: 'ifeanyidike87@gmail.com',
      // });
      // console.log({ newUser });

      // console.log(jsonMessage);
      if (socket.isGuest || !data.courseId) {
        await sendMessageToGuestUsers(io, socket, channelId, data);
      } else {
        await sendMessageToNonGuestUsers(io, socket, channelId, data);
      }
    });
    socket.on('isTyping', (data: any) => {
      socket.broadcast.emit('onUserTyping', data);
    });

    socket.on('disconnect', async () => {
      const userEmail = socket.userEmail;
      const allSockets = await io.in(channelId).fetchSockets();

      const matchingSockets = allSockets.filter(
        (s: any) => s.userEmail === socket.userEmail
      );

      const isDisconnected = matchingSockets.length === 0;

      if (isDisconnected) {
        const channelUsers = onlineUsers[channelId];
        const newChannelOnlineUsers = channelUsers.filter(
          (socketUser: any) => socketUser?.email !== userEmail
        );
        onlineUsers = {
          ...onlineUsers,
          [channelId]: [...newChannelOnlineUsers],
        };

        // notify other users
        io.to(channelId).emit('connected_users', newChannelOnlineUsers);
      }
    });
  });
};

const sendMessageToNonGuestUsers = async (
  io: SocketServer<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
  socket: any,
  channelId: string,
  data: IMessageData
) => {
  try {
    const message: any = await Message.create({
      text: data.message,
      html: `<p>${data.message}</p>`,
    });
    const chatCourse: any = await ChatCourse.findOne({
      where: { id: data.courseId },
    });

    const user: any = await User.findOne({
      where: { email: socket.userEmail },
    });

    await chatCourse?.addMessage(message);
    await user?.addMessage(message);

    const jsonMessage = message.toJSON();
    const jsonChatCourse = chatCourse.toJSON();
    const jsonUser = user.toJSON();

    jsonMessage.chatcourseId = jsonChatCourse.id;
    jsonMessage.userId = jsonUser.id;
    jsonMessage.chatcourse = jsonChatCourse;
    jsonMessage.user = jsonUser;
    jsonMessage.type = data.type;

    io.to(channelId).emit('onReceiveMessage', jsonMessage);
  } catch (error) {
    console.log(error);
  }
};

const sendMessageToGuestUsers = async (
  io: SocketServer<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
  socket: any,
  channelId: string,
  data: IMessageData
) => {
  // const outputData = {
  //   message: data.message,
  //   receiver: data.receiver,
  //   sender: data.sender,
  //   type: data.type,
  //   courseId: data.courseId,
  //   createdAt: data.createdAt,
  // };
  // const text = data.message;
  const outputData = {
    text: data.message,
    sender: socket.user,
    guestId: socket.user?.id || data?.receiver?.id,
    location: socket.location || data?.receiver?.name,
    type: data.type,
    courseId: data.courseId,
    createdAt: data.createdAt,
  };

  io.to(channelId).emit('onReceiveServiceMessage', outputData);
};

export default initializeSocket;
