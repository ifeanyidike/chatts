//imports
import express from 'express';
import { createServer } from 'http';
import initializeSocket from './websockets';
import sequelize from './db/dbconfig';

const app = express();
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

initializeSocket(httpServer);

app.use(express.static(__dirname + '/scripts'));

httpServer.listen(9100);
