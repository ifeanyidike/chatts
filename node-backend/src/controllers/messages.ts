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
      order: [['createdAt', 'ASC']],
    });
    res.status(200).json(messages);
  } catch (error) {
    next(error);
  }
};

export const deleteMessage = async (req: any, res: any, next: Function) => {
  try {
    const { id } = req.params;
    await Message.destroy({ where: { id } });
    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
};

export const editMessage = async (req: any, res: any, next: Function) => {
  try {
    const { id } = req.params;
    const { message } = req.body;
    await Message.update(
      { text: message, html: `<p>${message}</p>` },
      { where: { id } }
    );
    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
};
