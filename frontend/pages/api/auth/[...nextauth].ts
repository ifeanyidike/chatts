import NextAuth from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';
import FacebookProvider from 'next-auth/providers/facebook';
import { Sequelize, DataTypes } from 'sequelize';
import SequelizeAdapter, { models } from '@next-auth/sequelize-adapter';

const sequelize = new Sequelize(
  'postgres://postgres:Desmond_82@127.0.0.1:5432/chatts'
);

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      //   authorization: {
      //     params: {
      //       prompt: 'consent',
      //       access_type: 'offline',
      //       response_type: 'code',
      //     },
      //   },
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
    }),
    // ...add more providers here
  ],
  adapter: SequelizeAdapter(sequelize, {
    models: {
      User: sequelize.define(
        'user',
        {
          ...models.User,
        },
        { timestamps: true }
      ),
    },
  }),
};

export default NextAuth(authOptions);
