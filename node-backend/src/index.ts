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
// app.use(params => middlewares({ ...params, app }));
// app.use(params => middlewares(params, app));

// (async () => {
//   const newChannel = await Channel.create({
//     key: nanoid(),
//     type: 'service',
//     url: 'http://localhost:3000',
//   });
//   console.log({ newChannel });
// })();

initializeSocket(httpServer);

app.use(express.static(__dirname + '/scripts'));

httpServer.listen(9100);
