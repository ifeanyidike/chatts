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
  },
  {
    timestamps: true,
  }
);

Channel.hasMany(Message);
Message.belongsTo(Channel);

ChatCourse.hasMany(Message);
Message.belongsTo(ChatCourse);

User.hasMany(Message);
Message.belongsTo(User);

(async () => {
  await sequelize.sync({});
})();

export default Message;
