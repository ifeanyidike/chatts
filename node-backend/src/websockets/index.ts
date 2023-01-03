import { Server as SocketServer } from 'socket.io';
import { IncomingMessage, ServerResponse, Server as HttpServer } from 'http';
import User from '../models/User';

//  io.of(/\w*([\W\w])/g).on('connection', socket => {
//     const namespaceSocket = socket.nsp;
//     const namespace = namespaceSocket.name.substring(1);

const initializeSocket = (
  httpServer: HttpServer<typeof IncomingMessage, typeof ServerResponse>
) => {
  const io = new SocketServer(httpServer, {
    cors: {
      origin: ['http://localhost:3000'],
      allowedHeaders: ['my-custom-header'],
      credentials: true,
    },
  });

  io.of(/\w*([\W\w])/g).on('connection', socket => {
    socket.on('onSendMessage', async data => {
      socket.emit('message', data);
      // const newUser = await User.create({
      //   firstName: 'Ifeanyi',
      //   lastName: 'Dike',
      //   email: 'ifeanyidike87@gmail.com',
      // });
      // console.log({ newUser });
    });
    socket.on('isTyping', data => {
      socket.broadcast.emit('onUserTyping', data);
    });
  });
};

export default initializeSocket;
