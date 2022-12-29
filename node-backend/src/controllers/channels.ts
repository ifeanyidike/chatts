import Channel from '../models/Channel';

export const getChannelByKey = async (req: any, res: any, next: any) => {
  try {
    const { key } = req.params;
    const channel = await Channel.findOne({ where: { key } });

    res.status(200).json(channel);
  } catch (error) {
    next(error);
  }
};

export const getAllChannels = async (req: any, res: any, next: any) => {
  try {
    const channels = await Channel.findAll();
    res.status(200).json(channels);
  } catch (error) {
    next(error);
  }
};
