import ChatCourse from '../models/chatcourse';
import Message from '../models/Message';
import User from '../models/User';

export const createMessage = async (req: any, res: any, next: any) => {
  try {
    const { key } = req.params;
    const channel = await Message.create({});

    res.status(200).json(channel);
  } catch (error) {
    next(error);
  }
};

export const getCourseMessages = async (req: any, res: any, next: Function) => {
  try {
    const { chatcourseId } = req.params;
    const messages = await Message.findAll({
      where: { chatcourseId },
      include: [User, ChatCourse],
    });
    res.status(200).json(messages);
  } catch (error) {
    next(error);
  }
};
