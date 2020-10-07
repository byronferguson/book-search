const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth');
const { User } = require('../models');

const resolvers = {
  Query: {
    me: async (_, { id, username }, { user }) => {
      const foundUser = await User.findOne({
        $or: [{ _id: user ? user._id : id }, { username }],
      })
        .select('-__v -password')
        .populate('savedBooks');

      if (!foundUser) {
        throw new AuthenticationError('Cannot find a user with this id!');
      }

      return foundUser;
    },
  },

  Mutation: {
    login: async (_, { email, password }) => {
      const user = await User.findOne({ email })
        .select('-__v -password')
        .populate('savedBooks');

      if (!user) {
        throw new AuthenticationError('Incorrect credentials');
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError('Incorrect credentials');
      }

      const token = signToken(user);

      return { user, token };
    },

    addUser: async (_, args) => {
      const user = await User.create(args);
      const token = signToken(user);

      return { user, token };
    },

    saveBook: async (_, args, { user }) => {
      if (!user) {
        throw new AuthenticationError('You need to be logged in!');
      }

      const updatedUser = await User.findOneAndUpdate(
        { _id: user._id },
        { $addToSet: { savedBooks: args } },
        { new: true, runValidators: true }
      )
        .select('-__v -password')
        .populate('savedBooks');

      return updatedUser;
    },

    removeBook: async (_, { bookId }, { user }) => {
      if (!user) {
        throw new AuthenticationError('You need to be logged in!');
      }

      const updatedUser = await User.findOneAndUpdate(
        { _id: user._id },
        { $pull: { savedBooks: { bookId } } },
        { new: true }
      )
        .select('-__v -password')
        .populate('savedBooks');

      return updatedUser;
    },
  },
};

module.exports = resolvers;
