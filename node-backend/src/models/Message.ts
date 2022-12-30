import { DataTypes } from 'sequelize';
import sequelize from '../db/dbconfig';
import Channel from './Channel';
import User from './User';

const Message = sequelize.define(
  'message',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    text: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    html: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    messageId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    channelId: {
      type: DataTypes.STRING,
      references: {
        model: Channel,
        key: 'key',
      },
    },
    user: {
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: 'id',
      },
    },
  },
  {
    timestamps: true,
  }
);

(async () => {
  await sequelize.sync({ force: true });
})();

export default Message;
