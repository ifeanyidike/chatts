import { Op } from 'sequelize';
import Channel from '../models/Channel';
import ChatCourse, { ChatCourseMember } from '../models/chatcourse';
import User from '../models/User';

export const createCourse = async (req: any, res: any, next: Function) => {
  const { members, activeTab, channelKey, name } = req.body;
  try {
    if (activeTab === 'service') {
      const chatCourse = await ChatCourse.findOne({
        where: { title: name },
      });

      if (chatCourse) return res.status(200).json(chatCourse);
    }

    const users = await User.findAll({
      where: {
        email: members,
      },
    });

    const userData = users?.map(user => user.dataValues);
    const userIds = userData.map(user => user.id);
    const chatCourseMember = await ChatCourseMember.findAll({
      where: {
        userId: userIds,
      },
    });
    if (chatCourseMember.length) {
      return res.status(200).json(chatCourseMember);
    }

    const chatCourse: any = await ChatCourse.create({ type: activeTab });
    const createdCourse = await chatCourse.addUsers(users);

    const currentChannel: any = await Channel.findOne({
      where: { key: channelKey },
    });
    const userChannel = await currentChannel.addChatcourse(chatCourse);

    return res.status(200).json(createdCourse);
    // const courses = await ChatCourse.findOne();
  } catch (error) {
    next(error);
  }
};

export const getCoursesByChannel = async (
  req: any,
  res: any,
  next: Function
) => {
  const { key } = req.params;
  const { type } = req.query;

  try {
    const chatCourse = await ChatCourse.findAll({
      where: { channelKey: key, type },
      include: User,
    });
    res.status(200).json(chatCourse);
  } catch (error) {
    next(error);
  }
};

export const addCourse = async (req: any, res: any, next: Function) => {
  console.log('addCourse for group');
  const { course } = req.body;
  try {
    const existingCourse = await ChatCourse.findOne({
      where: { id: course.id },
    });

    if (existingCourse) return res.status(403).send('Course already exist');

    await ChatCourse.create(course);
    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
};
