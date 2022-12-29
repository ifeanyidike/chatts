import { Express } from 'express';
import Channels from '../routes/channels';

const initializeMiddlewares = (app: Express) => {
  app.use('/api/channels', Channels);
};

export default initializeMiddlewares;
