import { DataTypes } from 'sequelize';
import sequelize from '../db/dbconfig';
import Channel from './Channel';
import User from './User';

const ChatCourse = sequelize.define(
  'chatcourse',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
    },
    type: {
      type: DataTypes.ENUM,
      values: ['direct', 'group', 'service'],
      allowNull: false,
    },
    tags: {
      type: DataTypes.STRING,
    },
  },
  {
    timestamps: true,
  }
);

export const ChatCourseMember = sequelize.define(
  'ChatCourseMember',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
    },
    chatcourseId: {
      type: DataTypes.UUID,
    },
  },
  {
    timestamps: true,
  }
);

Channel.hasMany(ChatCourse);
ChatCourse.belongsTo(Channel);

User.belongsToMany(ChatCourse, { through: ChatCourseMember });
ChatCourse.belongsToMany(User, { through: ChatCourseMember });

(async () => {
  await sequelize.sync();
})();

export default ChatCourse;
