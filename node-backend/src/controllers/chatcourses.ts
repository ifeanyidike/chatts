import { Op } from 'sequelize';
import Channel from '../models/Channel';
import ChatCourse, { ChatCourseMember } from '../models/chatcourse';
import User from '../models/User';

export const createCourse = async (req: any, res: any, next: Function) => {
  const { members, activeTab, channelKey } = req.body;
  const formattedMembers = members.map((m: string) => {
    return {
      email: m,
    };
  });

  // console.log({ formattedMembers });
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
};
