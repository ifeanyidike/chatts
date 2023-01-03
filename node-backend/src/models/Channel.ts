import { DataTypes } from 'sequelize';
import sequelize from '../db/dbconfig';
import User from './User';

const Channel = sequelize.define(
  'channel',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      unique: true,
    },
    key: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdBy: {
      type: DataTypes.UUID,
      references: {
        model: User,
        key: 'id',
      },
    },
  },
  { timestamps: true }
);

User.belongsToMany(Channel, { through: 'ChannelUsers' });
Channel.belongsToMany(User, { through: 'ChannelUsers' });

(async () => {
  await sequelize.sync();
})();

export default Channel;
