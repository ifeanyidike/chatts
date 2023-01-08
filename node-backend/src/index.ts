//imports
import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import initializeSocket from './websockets';
import sequelize from './db/dbconfig';
import middlewares from './middlewares';
import { nanoid } from 'nanoid';
import Channel from './models/Channel';

import ChannelRoutes from './routes/channels';
import ChatCourseRoutes from './routes/chatcourses';
import User from './models/User';

const app = express();
app.use(cors());
const httpServer = createServer(app);

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established');
  } catch (error) {
    console.log(
      'An error occurred when connection to postgres database:',
      error
    );
  }
})();

app.use(express.json());
// middlewares(app);
app.use('/api/channels', ChannelRoutes);
app.use('/api/chatcourse', ChatCourseRoutes);
// app.use(params => middlewares({ ...params, app }));
// app.use(params => middlewares(params, app));

(async () => {
  //   const channelKey = nanoid();
  //   const member1 = 'f79ca305-2b31-4510-8fb6-24073eeb31dd';
  //   const member2 = 'aed38dd6-d744-4686-aa65-c35dfd91e6f8';
  //   const channel = await Channel.findOne({
  //     where: { key: 'rMmM33vivYJq5JBryIZGN' },
  //   });
  //   const user: any = await User.findOne({
  //     where: { id: 'aed38dd6-d744-4686-aa65-c35dfd91e6f8' },
  //   });
  //   console.log('USER CHANNEL', { channel });
  //   console.log('USER INFO', { user });
  // await channel?.addUser(user);
  //   await user?.addChannel(channel);
  // await sequelize.sync();
  //   const channelMember = await ChannelMember.create({
  //     channel: newChannel.dataValues.key,
  //     user: member1,
  //     isOwner: true,
  //   });
  //   console.log({ channelMember });
})();

// (async () => {
// //   await sequelize.sync();
//   const channelMember = await ChannelMember.create({
//     channel: 'rMmM33vivYJq5JBryIZGN',
//     user: '904e7720-7f2f-43a2-8cdc-5e85073d199f',
//     isOwner: true,
//   });
//   console.log({ channelMember });
// })();

initializeSocket(httpServer);

app.use(express.static(__dirname + '/scripts'));

httpServer.listen(9100);
