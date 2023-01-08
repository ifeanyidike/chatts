import Message from '../models/Message';

export const createMessage = async (req: any, res: any, next: any) => {
  try {
    const { key } = req.params;
    const channel = await Message.create({});

    res.status(200).json(channel);
  } catch (error) {
    next(error);
  }
};
