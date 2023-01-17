import { ChatCourseMember } from './../models/chatcourse';
import Channel from '../models/Channel';
import ChatCourse from '../models/chatcourse';
import User from '../models/User';
import * as userService from '../services/user';
import { Op } from 'sequelize';
import Message from '../models/Message';

export const findUserByEmail = async (req: any, res: any, next: any) => {
  const { email } = req.params;
  const user = await User.findOne({
    where: { email },
  });

  res.status(200).json(user);
};

export const getUserAndMessages = async (
  req: any,
  res: any,
  next: Function
) => {
  try {
    const { loc, key } = req.query;

    const course = await ChatCourse.findOne({
      where: { title: loc },
    });

    const channel = await Channel.findOne({ where: { key } });
    const createdBy = channel?.dataValues.createdBy;
    const admin = await User.findOne({
      where: { id: createdBy },
    });

    if (!course) return res.status(200).json({ admin });

    let chatcourseId = course?.dataValues.id;

    const channelMember = await ChatCourseMember.findOne({
      where: {
        chatcourseId,
        userId: {
          [Op.ne]: createdBy,
        },
      },
    });

    const user: any = await User.findOne({
      where: {
        id: channelMember?.dataValues.userId,
      },
    });

    const jsonUser = user.toJSON();
    jsonUser.chatcourseId = chatcourseId;

    const messages = await Message.findAll({
      where: { chatcourseId },
      include: [User, ChatCourse],
      order: [['createdAt', 'ASC']],
    });

    res.status(200).json({ user: jsonUser, admin, messages });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const findUserById = (req: any, res: any, next: any) => {};

export const handleAuthenticateWidgetUser = async (
  req: any,
  res: any,
  next: Function
) => {
  const { signInInfo, courseMessages, channelKey, title } = req.body;
  const { email, name } = signInInfo;
  try {
    let user: any = await User.findOne({
      where: { email },
    });

    if (!user && !name) res.status(403).json('User does not exist');

    if (!user && name) {
      user = await User.create({
        email,
        name,
      });
    }

    const currentUser = user.toJSON();

    const result = await userService.handleAuthenticateWidgetUser(
      currentUser,
      courseMessages,
      channelKey,
      title
    );

    req.io?.to(channelKey)?.emit('onInitWidgetUser', result?.allMessages);

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
