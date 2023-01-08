import { DataTypes } from 'sequelize';
import sequelize from '../db/dbconfig';
import Channel from './Channel';
import ChatCourse from './chatcourse';
import User from './User';

const Message = sequelize.define(
  'message',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
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
    coursetitle: {
      type: DataTypes.STRING,
    },
    type: {
      type: DataTypes.ENUM,
      values: ['direct', 'group', 'service'],
      allowNull: false,
    },
    isRead: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    isDelivered: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    timestamps: true,
  }
);

Channel.hasMany(ChatCourse);
ChatCourse.belongsTo(Channel);

ChatCourse.hasMany(Message);
Message.belongsTo(ChatCourse);

User.hasMany(Message);
Message.belongsTo(User);

(async () => {
  await sequelize.sync({});
})();

export default Message;
