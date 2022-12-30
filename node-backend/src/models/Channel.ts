import { DataTypes } from 'sequelize';
import sequelize from '../db/dbconfig';

const Channel = sequelize.define(
  'channel',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    key: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    type: {
      type: DataTypes.ENUM,
      values: ['service', 'group', 'direct'],
    },
    url: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
  },
  { timestamps: true }
);

(async () => {
  await sequelize.sync();
})();

export default Channel;
