import { nanoid } from 'nanoid';
import Channel from '../models/Channel';
import User from '../models/User';

export const getChannelByKey = async (req: any, res: any, next: any) => {
  try {
    const { key } = req.params;
    const channel = await Channel.findOne({ where: { key }, include: User });

    res.status(200).json(channel);
  } catch (error) {
    next(error);
  }
};

export const getAllChannels = async (req: any, res: any, next: any) => {
  try {
    const channels = await Channel.findAll({
      include: User,
    });
    res.status(200).json(channels);
  } catch (error) {
    next(error);
  }
};

export const getUsersChannelByEmail = async (req: any, res: any, next: any) => {
  const { email } = req.params;
  try {
    const user = await User.findOne({
      where: { email },
      include: Channel,
    });

    res.status(200).json(user);
  } catch (error: any) {
    console.log(error.message);
    next(error);
  }
};

export const createChannel = async (req: any, res: any, next: any) => {
  const { channelName, userId } = req.body;

  try {
    const currentUser = await User.findOne({
      where: { id: userId },
    });
    const channel: any = await Channel.create({
      title: channelName,
      createdBy: userId,
      key: nanoid(),
    });
    const updatedChannel = await channel?.addUser(currentUser);
    res.status(201).json(updatedChannel);
  } catch (error) {
    next(error);
  }
};

export const addUserToChannel = async (req: any, res: any, next: any) => {
  try {
    const { key } = req.params;
    const { userEmail } = req.body;
    console.log({ userEmail });
    const currentChannel: any = await Channel.findOne({ where: { key } });
    const currentUser = await User.findOne({ where: { email: userEmail } });

    const updatedChannel = await currentChannel?.addUser(currentUser);
    console.log({ updatedChannel });

    // const channel = await Channel.findOne({ where: { key }, include: User });

    res.status(200).json(updatedChannel);
  } catch (error) {}
};
