import Channel from '../models/Channel';
import ChatCourse, { ChatCourseMember } from '../models/chatcourse';
import Message from '../models/Message';
import User from '../models/User';

export const handleAuthenticateWidgetUser = async (
  user: any,
  courseMessages: any,
  channelKey: string,
  title: string
) => {
  try {
    const channel: any = await Channel.findOne({ where: { key: channelKey } });
    const createdBy = channel.dataValues.createdBy;

    const course: any = await ChatCourse.findOrCreate({
      where: { title, type: 'service' },
    });

    const [chatCourse, created]: any = course;

    if (created) {
      const members = [user.id, createdBy];
      const users = await User.findAll({
        where: {
          id: members,
        },
      });

      const createdCourse = await chatCourse.addUsers(users);
      const currentChannel: any = await Channel.findOne({
        where: { key: channelKey },
      });

      await currentChannel.addChatcourse(chatCourse);
    }

    //add courseMessages
    const formattedMessages = courseMessages.map((m: any) => {
      return {
        text: m.text,
        html: `<p>${m.text}</p>`,
        createdAt: m.createdAt,
        userId:
          m.user?.name === 'Guest' ? user.id.toString() : createdBy.toString(),
        chatcourseId: chatCourse.dataValues.id.toString(),
      };
    });

    const bulkMessages = await Message.bulkCreate(formattedMessages);

    const allMessages = await Message.findAll({
      where: { chatcourseId: chatCourse.dataValues.id },
      include: [User, ChatCourse],
    });

    return { allMessages, user, chatCourse };
  } catch (error) {
    console.log(error);
  }
};
