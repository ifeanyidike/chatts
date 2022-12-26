import { DataTypes } from 'sequelize';
import sequelize from '../db/dbconfig';

const Channel = sequelize.define(
  'Channel',
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
  },
  { timestamps: true }
);

(async () => {
  await sequelize.sync({ force: true });
})();

export default Channel;
