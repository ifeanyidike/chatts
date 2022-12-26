// import { Pool } from 'pg';

// //initialize database pool
// // connectionString: 'postgres://user:password@hostname:port/dbname'

// const pool: Pool = new Pool({
//   max: 20,
//   connectionString: 'postgres://postgres:Desmond_82@127.0.0.1:5432/chatts',
//   idleTimeoutMillis: 30000,
//   connectionTimeoutMillis: 2000,
// });

// export default pool;

import { Sequelize } from 'sequelize';

const sequelize = new Sequelize(
  'postgres://postgres:Desmond_82@127.0.0.1:5432/chatts',
  {
    logging: (...msg) => console.log(msg),
    pool: {
      max: 20,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

export default sequelize;
